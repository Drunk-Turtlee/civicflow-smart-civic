import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

logger = logging.getLogger(__name__)

INITIAL_COMPLAINTS = [
  { 
    "id": "CIV-2026-1048", 
    "title": "Streetlight not working near Gate 3", 
    "category": "Streetlight", 
    "location": "Sector 18, Noida", 
    "priority": "High", 
    "status": "In Progress", 
    "age": 6, 
    "assigned": "Ravi Kumar", 
    "score": 92, 
    "time": "Today, 9:42 AM", 
    "description": "There has been no street light near Gate 3 for almost a week and the road gets extremely dark.",
    "anonymous": False,
    "created_by": "Ramesh Gupta",
    "created_at": datetime.utcnow() - timedelta(days=6),
    "updated_at": datetime.utcnow() - timedelta(hours=2),
    "comments": [{"author": "Ravi Kumar", "text": "Inspection scheduled for this afternoon.", "created_at": (datetime.utcnow() - timedelta(hours=1)).isoformat()}],
    "timeline": [
        {"status": "New", "updated_at": (datetime.utcnow() - timedelta(days=6)).isoformat(), "updated_by": "System"},
        {"status": "Assigned", "updated_at": (datetime.utcnow() - timedelta(days=4)).isoformat(), "updated_by": "Operations Manager"},
        {"status": "In Progress", "updated_at": (datetime.utcnow() - timedelta(hours=2)).isoformat(), "updated_by": "Ravi Kumar"}
    ]
  },
  { 
    "id": "CIV-2026-1047", 
    "title": "Large pothole causing traffic slowdown", 
    "category": "Pothole / Road", 
    "location": "MG Road Junction", 
    "priority": "High", 
    "status": "Assigned", 
    "age": 3, 
    "assigned": "Roads Team A", 
    "score": 86, 
    "time": "Today, 8:15 AM", 
    "description": "Deep pothole on the left lane near the signal. Two-wheelers are struggling to pass.",
    "anonymous": False,
    "created_by": "Sunita Verma",
    "created_at": datetime.utcnow() - timedelta(days=3),
    "updated_at": datetime.utcnow() - timedelta(hours=5),
    "comments": [],
    "timeline": [
        {"status": "New", "updated_at": (datetime.utcnow() - timedelta(days=3)).isoformat(), "updated_by": "System"},
        {"status": "Assigned", "updated_at": (datetime.utcnow() - timedelta(hours=5)).isoformat(), "updated_by": "Dispatcher"}
    ]
  },
  { 
    "id": "CIV-2026-1046", 
    "title": "Garbage not collected for 3 days", 
    "category": "Garbage / Waste", 
    "location": "Sector 62 Market", 
    "priority": "Medium", 
    "status": "New", 
    "age": 3, 
    "assigned": "Unassigned", 
    "score": 74, 
    "time": "Yesterday, 6:30 PM", 
    "description": "The community bins are overflowing and garbage has not been collected since Monday.",
    "anonymous": True,
    "created_by": "Anonymous",
    "created_at": datetime.utcnow() - timedelta(days=3),
    "updated_at": datetime.utcnow() - timedelta(days=3),
    "comments": [],
    "timeline": [
        {"status": "New", "updated_at": (datetime.utcnow() - timedelta(days=3)).isoformat(), "updated_by": "System"}
    ]
  },
  { 
    "id": "CIV-2026-1045", 
    "title": "Low water pressure in Block B", 
    "category": "Water Supply", 
    "location": "Block B, Sector 50", 
    "priority": "Medium", 
    "status": "In Progress", 
    "age": 8, 
    "assigned": "Water Works 2", 
    "score": 78, 
    "time": "Yesterday, 10:18 AM", 
    "description": "Water pressure has been very low every morning for more than a week.",
    "anonymous": False,
    "created_by": "Anit Singh",
    "created_at": datetime.utcnow() - timedelta(days=8),
    "updated_at": datetime.utcnow() - timedelta(days=1),
    "comments": [{"author": "Water Works 2", "text": "Valve maintenance ongoing.", "created_at": (datetime.utcnow() - timedelta(days=1)).isoformat()}],
    "timeline": [
        {"status": "New", "updated_at": (datetime.utcnow() - timedelta(days=8)).isoformat(), "updated_by": "System"},
        {"status": "In Progress", "updated_at": (datetime.utcnow() - timedelta(days=1)).isoformat(), "updated_by": "Water Works 2"}
    ]
  },
  { 
    "id": "CIV-2026-1044", 
    "title": "Open drain cover beside school", 
    "category": "Drainage", 
    "location": "Saraswati School Road", 
    "priority": "High", 
    "status": "Resolved", 
    "age": 12, 
    "assigned": "Civic Safety Team", 
    "score": 96, 
    "time": "2 days ago", 
    "description": "A drain cover is missing beside the school entrance.",
    "anonymous": False,
    "created_by": "Priya Sharma",
    "created_at": datetime.utcnow() - timedelta(days=12),
    "updated_at": datetime.utcnow() - timedelta(days=2),
    "comments": [{"author": "Civic Safety Team", "text": "Drain cover replaced and reinforced.", "created_at": (datetime.utcnow() - timedelta(days=2)).isoformat()}],
    "timeline": [
        {"status": "New", "updated_at": (datetime.utcnow() - timedelta(days=12)).isoformat(), "updated_by": "System"},
        {"status": "Resolved", "updated_at": (datetime.utcnow() - timedelta(days=2)).isoformat(), "updated_by": "Civic Safety Team"}
    ]
  }
]

class MemoryStore:
    def __init__(self):
        self.complaints: List[Dict[str, Any]] = [dict(item) for item in INITIAL_COMPLAINTS]
        self.users: List[Dict[str, Any]] = []
        self.seq_counter: int = 1049

    def get_next_id(self) -> str:
        self.seq_counter += 1
        year = datetime.utcnow().year
        return f"CIV-{year}-{self.seq_counter}"

memory_store = MemoryStore()

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_container = Database()

async def connect_to_mongo():
    logger.info(f"Attempting MongoDB connection at {settings.MONGODB_URL}...")
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=2000)
        # Test connection ping
        await client.admin.command('ping')
        db = client[settings.DATABASE_NAME]
        db_container.client = client
        db_container.db = db
        logger.info(f"Connected to MongoDB database '{settings.DATABASE_NAME}' successfully!")
        
        # Seed initial data if database is empty
        cnt = await db["complaints"].count_documents({})
        if cnt == 0:
            logger.info("Seeding initial complaints into MongoDB database...")
            await db["complaints"].insert_many([dict(item) for item in INITIAL_COMPLAINTS])
            await db["counters"].update_one(
                {"_id": "complaint_id"},
                {"$set": {"seq": 1049}},
                upsert=True
            )
            logger.info("Seeded initial data into MongoDB.")
    except Exception as e:
        logger.warning(f"MongoDB not available at {settings.MONGODB_URL} ({e}). Using fast in-memory store mode.")
        db_container.db = None

async def close_mongo_connection():
    if db_container.client:
        logger.info("Closing MongoDB connection.")
        db_container.client.close()

def get_database():
    return db_container.db
