import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

CATEGORY_WEIGHTS = {
    "Drainage": 30,
    "Pothole / Road": 25,
    "Streetlight": 20,
    "Water Supply": 20,
    "Garbage / Waste": 15,
    "Other": 10
}

def calculate_priority_score(category: str, age_days: int, similar_count: int = 0) -> Dict[str, Any]:
    """
    Rule-based prioritization based on:
    1. Issue Category weight
    2. Age of the complaint (days)
    3. Volume of similar complaints in the same location/category
    """
    # 1. Category Base Weight
    base_weight = CATEGORY_WEIGHTS.get(category, 10)
    
    # 2. Age Weight (4 points per day, max 40 points)
    age_weight = min(age_days * 4, 40)
    
    # 3. Similar Complaints Volume Weight (10 points per similar complaint, max 30 points)
    volume_weight = min(similar_count * 10, 30)
    
    # Total Score (0 to 100)
    score = min(100, base_weight + age_weight + volume_weight)
    
    # Determine Priority Bucket
    if score >= 75:
        priority = "High"
    elif score >= 45:
        priority = "Medium"
    else:
        priority = "Low"
        
    return {
        "score": score,
        "priority": priority,
        "breakdown": {
            "category_weight": base_weight,
            "age_weight": age_weight,
            "volume_weight": volume_weight
        }
    }
