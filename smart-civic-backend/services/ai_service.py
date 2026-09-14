from typing import Dict, Any

def analyze_complaint_text(description: str) -> Dict[str, Any]:
    """
    AI Smart Assist service:
    Extracts category, urgency level, and concise issue summary from unstructured complaint text.
    """
    text = description.lower()
    
    # 1. Category extraction
    if any(k in text for k in ["pothole", "hole"]):
        category = "Pothole"
    elif any(k in text for k in ["road", "tar", "asphalt", "lane", "traffic", "crack"]):
        category = "Road Damage"
    elif any(k in text for k in ["garbage", "waste", "trash", "dump", "bin", "clean"]):
        category = "Garbage"
    else:
        category = "Other"
        
    # 2. Urgency classification
    if any(k in text for k in ["danger", "accident", "school", "hazard", "emergency", "open drain", "severe"]):
        urgency = "High"
    elif any(k in text for k in ["week", "days", "overflow", "dark", "slowdown"]):
        urgency = "Medium"
    else:
        urgency = "Low"
        
    # 3. Summary generation
    clean_desc = description.strip()
    if len(clean_desc) > 110:
        summary = f"{clean_desc[:107]}..."
    else:
        summary = clean_desc
        
    return {
        "category": category,
        "urgency": urgency,
        "summary": summary
    }
