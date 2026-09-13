from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class Comment(BaseModel):
    author: str
    text: str
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class TimelineEvent(BaseModel):
    status: str
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_by: str = "System"

class ComplaintCreate(BaseModel):
    title: Optional[str] = None
    category: str  # Streetlight, Pothole / Road, Garbage / Waste, Water Supply, Drainage, Other
    description: str
    location: str
    priority: Optional[str] = "Medium"  # High, Medium, Low
    anonymous: bool = False
    photo_url: Optional[str] = None

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None  # New, Assigned, In Progress, Resolved
    assigned: Optional[str] = None
    priority: Optional[str] = None

class CommentCreate(BaseModel):
    text: str
    author: Optional[str] = "Municipal Officer"

class ComplaintResponse(BaseModel):
    id: str
    title: str
    category: str
    location: str
    priority: str
    status: str
    age: int
    assigned: str
    score: int
    time: str
    description: str
    anonymous: bool = False
    photo_url: Optional[str] = None
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    comments: List[Comment] = []
    timeline: List[TimelineEvent] = []

class AnalyticsStats(BaseModel):
    active: int
    resolved: int
    urgent: int
    response: str

class SLAItem(BaseModel):
    category: str
    percentage: float

class HotspotItem(BaseModel):
    location: str
    count: int

class DistributionItem(BaseModel):
    category: str
    count: int
