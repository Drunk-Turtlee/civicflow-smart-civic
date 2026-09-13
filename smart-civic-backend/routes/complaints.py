from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Depends, status
from models.complaint import ComplaintCreate, ComplaintUpdate, CommentCreate, ComplaintResponse, Comment, TimelineEvent
from services.prioritization_service import calculate_priority_score
from services.auth_service import get_current_user
from database import get_database, memory_store

router = APIRouter(prefix="/complaints", tags=["Complaints Queue"])

async def get_next_sequence_id() -> str:
    db = get_database()
    if db is not None:
        result = await db["counters"].find_one_and_update(
            {"_id": "complaint_id"},
            {"$inc": {"seq": 1}},
            upsert=True,
            return_document=True
        )
        seq_num = result.get("seq", 1049)
        return f"CIV-{datetime.utcnow().year}-{seq_num}"
    else:
        return memory_store.get_next_id()

@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
async def create_complaint(
    payload: ComplaintCreate,
    current_user: Optional[dict] = Depends(get_current_user)
):
    db = get_database()
    
    similar_count = 0
    if db is not None:
        similar_count = await db["complaints"].count_documents({
            "category": payload.category,
            "status": {"$ne": "Resolved"}
        })
    else:
        similar_count = sum(1 for c in memory_store.complaints if c["category"] == payload.category and c["status"] != "Resolved")
        
    scoring = calculate_priority_score(category=payload.category, age_days=0, similar_count=similar_count)
    priority = payload.priority or scoring["priority"]
    score = scoring["score"]
    
    cid = await get_next_sequence_id()
    now = datetime.utcnow()
    time_str = "Just now"
    
    title = payload.title or f"{payload.category} issue reported at {payload.location}"
    creator = "Anonymous" if payload.anonymous else (current_user.get("name", "Citizen") if current_user else "Citizen")
    
    doc = {
        "id": cid,
        "title": title,
        "category": payload.category,
        "location": payload.location,
        "priority": priority,
        "status": "New",
        "age": 0,
        "assigned": "Unassigned",
        "score": score,
        "time": time_str,
        "description": payload.description,
        "anonymous": payload.anonymous,
        "photo_url": payload.photo_url,
        "created_by": creator,
        "created_at": now,
        "updated_at": now,
        "comments": [],
        "timeline": [
            {
                "status": "New",
                "updated_at": now.isoformat(),
                "updated_by": creator
            }
        ]
    }
    
    if db is not None:
        await db["complaints"].insert_one(doc)
    else:
        memory_store.complaints.insert(0, doc)
        
    return ComplaintResponse(**doc)

@router.get("", response_model=List[ComplaintResponse])
async def list_complaints(
    q: Optional[str] = Query(None, description="Search term across id, title, location, category"),
    status_filter: Optional[str] = Query("All", alias="status"),
    priority_filter: Optional[str] = Query("All", alias="priority"),
    category_filter: Optional[str] = Query("All", alias="category"),
    sort_by: Optional[str] = Query("newest", alias="sort")
):
    db = get_database()
    if db is not None:
        query_dict = {}
        if status_filter and status_filter != "All":
            query_dict["status"] = status_filter
        if priority_filter and priority_filter != "All":
            query_dict["priority"] = priority_filter
        if category_filter and category_filter != "All":
            query_dict["category"] = category_filter
            
        if q and q.strip():
            search_regex = {"$regex": q.strip(), "$options": "i"}
            query_dict["$or"] = [
                {"id": search_regex},
                {"title": search_regex},
                {"location": search_regex},
                {"category": search_regex},
                {"description": search_regex}
            ]

        cursor = db["complaints"].find(query_dict)
        if sort_by == "priority":
            cursor = cursor.sort("score", -1)
        elif sort_by == "oldest":
            cursor = cursor.sort("age", -1)
        else:
            cursor = cursor.sort("created_at", -1)
            
        results = await cursor.to_list(length=200)
    else:
        # In-memory filtering
        results = memory_store.complaints
        if status_filter and status_filter != "All":
            results = [x for x in results if x.get("status") == status_filter]
        if priority_filter and priority_filter != "All":
            results = [x for x in results if x.get("priority") == priority_filter]
        if category_filter and category_filter != "All":
            results = [x for x in results if x.get("category") == category_filter]
        if q and q.strip():
            term = q.strip().lower()
            results = [x for x in results if any(term in str(x.get(k, "")).lower() for k in ["id", "title", "location", "category", "description"])]
            
        if sort_by == "priority":
            results = sorted(results, key=lambda x: x.get("score", 0), reverse=True)
        elif sort_by == "oldest":
            results = sorted(results, key=lambda x: x.get("age", 0), reverse=True)
        else:
            results = sorted(results, key=lambda x: str(x.get("id", "")), reverse=True)
            
    out = []
    for item in results:
        doc = dict(item)
        if "created_at" in doc and isinstance(doc["created_at"], datetime):
            delta_days = (datetime.utcnow() - doc["created_at"]).days
            doc["age"] = max(doc.get("age", 0), delta_days)
            res_scoring = calculate_priority_score(doc["category"], doc["age"], similar_count=2)
            doc["score"] = res_scoring["score"]
        out.append(ComplaintResponse(**doc))
        
    return out

@router.get("/{complaint_id}", response_model=ComplaintResponse)
async def get_complaint(complaint_id: str):
    db = get_database()
    if db is not None:
        item = await db["complaints"].find_one({"id": complaint_id})
    else:
        item = next((c for c in memory_store.complaints if c["id"] == complaint_id), None)
        
    if not item:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    return ComplaintResponse(**item)

@router.patch("/{complaint_id}", response_model=ComplaintResponse)
async def update_complaint(
    complaint_id: str,
    payload: ComplaintUpdate,
    current_user: Optional[dict] = Depends(get_current_user)
):
    db = get_database()
    if db is not None:
        existing = await db["complaints"].find_one({"id": complaint_id})
    else:
        existing = next((c for c in memory_store.complaints if c["id"] == complaint_id), None)
        
    if not existing:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    now = datetime.utcnow()
    updater_name = current_user.get("name", "Operations Officer") if current_user else "Operations Officer"
    
    if payload.status and payload.status != existing.get("status"):
        existing["status"] = payload.status
        timeline = existing.get("timeline", [])
        timeline.append({
            "status": payload.status,
            "updated_at": now.isoformat(),
            "updated_by": updater_name
        })
        existing["timeline"] = timeline

    if payload.assigned is not None:
        existing["assigned"] = payload.assigned
        
    if payload.priority is not None:
        existing["priority"] = payload.priority

    existing["updated_at"] = now

    if db is not None:
        await db["complaints"].update_one({"id": complaint_id}, {"$set": existing})
        
    return ComplaintResponse(**existing)

@router.post("/{complaint_id}/comments", response_model=ComplaintResponse)
async def add_comment(
    complaint_id: str,
    payload: CommentCreate,
    current_user: Optional[dict] = Depends(get_current_user)
):
    db = get_database()
    if db is not None:
        existing = await db["complaints"].find_one({"id": complaint_id})
    else:
        existing = next((c for c in memory_store.complaints if c["id"] == complaint_id), None)
        
    if not existing:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    author = payload.author or (current_user.get("name") if current_user else "Municipal Officer")
    new_comment = {
        "author": author,
        "text": payload.text,
        "created_at": datetime.utcnow().isoformat()
    }
    
    if "comments" not in existing or not isinstance(existing["comments"], list):
        existing["comments"] = []
    existing["comments"].append(new_comment)
    existing["updated_at"] = datetime.utcnow()
    
    if db is not None:
        await db["complaints"].update_one(
            {"id": complaint_id},
            {"$push": {"comments": new_comment}, "$set": {"updated_at": datetime.utcnow()}}
        )
        
    return ComplaintResponse(**existing)
