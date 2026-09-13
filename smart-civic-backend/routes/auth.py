from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, status
from models.user import GoogleAuthRequest, Token, UserResponse
from services.auth_service import verify_google_token, create_access_token, get_current_user
from database import get_database

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/google", response_model=Token)
async def google_login(body: GoogleAuthRequest):
    """
    Authenticate user using Google OAuth ID Token.
    Upserts user record in MongoDB and returns JWT access token.
    """
    google_user = await verify_google_token(body.credential)
    db = get_database()
    
    email = google_user["email"]
    
    # Define default admin accounts if needed (e.g. admin email patterns)
    role = "admin" if ("admin" in email or email.endswith("@civicflow.gov")) else "citizen"
    
    user_doc = {
        "email": email,
        "name": google_user["name"],
        "picture": google_user["picture"],
        "google_id": google_user["google_id"],
        "role": role,
        "updated_at": datetime.utcnow()
    }
    
    if db is not None:
        await db["users"].update_one(
            {"email": email},
            {"$set": user_doc, "$setOnInsert": {"created_at": datetime.utcnow()}},
            upsert=True
        )
        existing = await db["users"].find_one({"email": email})
        user_id = str(existing["_id"])
        created_at = existing.get("created_at", datetime.utcnow())
    else:
        user_id = "mock_user_id"
        created_at = datetime.utcnow()

    token_data = {"sub": email, "name": google_user["name"], "role": role}
    access_token = create_access_token(data=token_data)
    
    user_response = UserResponse(
        id=user_id,
        email=email,
        name=google_user["name"],
        picture=google_user["picture"],
        role=role,
        created_at=created_at
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    
    return UserResponse(
        id=str(current_user.get("_id", "1")),
        email=current_user["email"],
        name=current_user["name"],
        picture=current_user.get("picture"),
        role=current_user.get("role", "citizen"),
        created_at=current_user.get("created_at", datetime.utcnow())
    )
