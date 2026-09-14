// -----------------------------------------------------------------------------
// complaintsStore.js — User session & MongoDB complaint data synchronization
// -----------------------------------------------------------------------------

const STORAGE_KEY = "civicflow_complaints_v1";
const API_BASE = "http://localhost:8000/api/complaints";

// Default initial complaints owned by the demo citizen (Ramesh Gupta)
const DEFAULT_COMPLAINTS = [
  {
    id: "CIV-2026-1048",
    title: "Streetlight not working near Gate 3",
    category: "Streetlight",
    location: "Sector 18, Noida",
    priority: "High",
    status: "In Progress",
    age: 6,
    assigned: "Ravi Kumar",
    score: 92,
    time: "Today, 9:42 AM",
    description: "There has been no street light near Gate 3 for almost a week and the road gets extremely dark.",
    created_by: "Ramesh Gupta",
    created_by_email: "citizen@civicflow.org",
  },
  {
    id: "CIV-2026-1047",
    title: "Large pothole causing traffic slowdown",
    category: "Pothole / Road",
    location: "MG Road Junction",
    priority: "High",
    status: "Assigned",
    age: 3,
    assigned: "Roads Team A",
    score: 86,
    time: "Today, 8:15 AM",
    description: "Deep pothole on the left lane near the signal. Two-wheelers are struggling to pass.",
    created_by: "Ramesh Gupta",
    created_by_email: "citizen@civicflow.org",
  },
  {
    id: "CIV-2026-1046",
    title: "Garbage not collected for 3 days",
    category: "Garbage / Waste",
    location: "Sector 62 Market",
    priority: "Medium",
    status: "New",
    age: 3,
    assigned: "Unassigned",
    score: 74,
    time: "Yesterday, 6:30 PM",
    description: "The community bins are overflowing and garbage has not been collected since Monday.",
    created_by: "Ramesh Gupta",
    created_by_email: "citizen@civicflow.org",
  },
  {
    id: "CIV-2026-1045",
    title: "Low water pressure in Block B",
    category: "Water Supply",
    location: "Block B, Sector 50",
    priority: "Medium",
    status: "In Progress",
    age: 8,
    assigned: "Water Works 2",
    score: 78,
    time: "Yesterday, 10:18 AM",
    description: "Water pressure has been very low every morning for more than a week.",
    created_by: "Anit Singh",
    created_by_email: "anit@smartcivic.org",
  },
  {
    id: "CIV-2026-1044",
    title: "Drainage overflow beside school",
    category: "Drainage",
    location: "Saraswati School Road",
    priority: "High",
    status: "Resolved",
    age: 12,
    assigned: "Civic Safety Team",
    score: 96,
    time: "2 days ago",
    description: "Drain cover missing and water overflowing beside school entrance.",
    created_by: "Priya Sharma",
    created_by_email: "priya@smartcivic.org",
  },
];

// Get current logged-in user from localStorage
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("civic_user");
    if (!raw) return { name: "Citizen", role: "citizen", email: "" };
    return JSON.parse(raw);
  } catch {
    return { name: "Citizen", role: "citizen", email: "" };
  }
}

// Generate dynamic time-based greeting (Good morning / afternoon / evening)
export function getTimeGreeting(userName) {
  const hour = new Date().getHours();
  let timeStr = "Good morning";
  if (hour >= 12 && hour < 17) {
    timeStr = "Good afternoon";
  } else if (hour >= 17 || hour < 5) {
    timeStr = "Good evening";
  }
  const name = userName || getCurrentUser().name || "User";
  return `${timeStr}, ${name}`;
}

// Get all stored complaints from localStorage (synced with MongoDB)
export function getAllComplaints() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COMPLAINTS));
      return DEFAULT_COMPLAINTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_COMPLAINTS;
  }
}

// Get complaints filtered for the current user's session
export function getUserComplaints(user = getCurrentUser()) {
  const all = getAllComplaints();
  
  // Admins see all municipal complaints
  if (user?.role === "admin") {
    return all;
  }

  // If citizen is the demo user "citizen@civicflow.org" or "Ramesh Gupta", show demo complaints
  if (user?.email === "citizen@civicflow.org" || user?.name === "Ramesh Gupta") {
    return all.filter(c => c.created_by_email === "citizen@civicflow.org" || c.created_by === "Ramesh Gupta");
  }

  // Any other registered user only sees their own complaints
  return all.filter(
    (c) =>
      (user?.email && c.created_by_email?.toLowerCase() === user.email.toLowerCase()) ||
      (user?.name && c.created_by?.toLowerCase() === user.name.toLowerCase())
  );
}

// Asynchronously fetch complaints from FastAPI MongoDB backend
export async function syncComplaintsFromDB(user = getCurrentUser()) {
  try {
    const url = user?.role === "admin"
      ? API_BASE
      : (user?.email ? `${API_BASE}?created_by_email=${encodeURIComponent(user.email)}` : API_BASE);
    
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Merge with local storage
        const currentLocal = getAllComplaints();
        const mergedMap = new Map();
        [...currentLocal, ...data].forEach(item => mergedMap.set(item.id, item));
        const merged = Array.from(mergedMap.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return user?.role === "admin" ? merged : merged.filter(c => c.created_by_email?.toLowerCase() === user?.email?.toLowerCase());
      }
    }
  } catch (err) {
    console.warn("Backend sync fallback to local cache:", err.message);
  }
  return getUserComplaints(user);
}

// Add a newly submitted complaint -> POST to FastAPI MongoDB backend + update local cache
export async function addComplaint(formData, user = getCurrentUser()) {
  const creatorName = formData.anonymous ? "Anonymous" : (user?.name || "Citizen");
  const creatorEmail = user?.email || "";

  const payload = {
    category: formData.category || "General",
    description: formData.description,
    location: formData.location || "City Center",
    priority: formData.priority || "Medium",
    anonymous: !!formData.anonymous,
    photo_url: formData.photo || null,
    image_verification: formData.imageVerification || null,
    created_by: creatorName,
    created_by_email: creatorEmail,
  };

  let savedComplaint = null;

  // 1. Post to MongoDB Backend
  try {
    const token = localStorage.getItem("civic_token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(API_BASE, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      savedComplaint = await res.json();
    }
  } catch (err) {
    console.warn("Could not reach backend, storing locally:", err.message);
  }

  // 2. Fallback / Local sync
  if (!savedComplaint) {
    const all = getAllComplaints();
    const newSeq = all.length + 1049;
    savedComplaint = {
      id: `CIV-2026-${newSeq}`,
      title: formData.description.slice(0, 48) + (formData.description.length > 48 ? "..." : ""),
      category: formData.category || "General",
      location: formData.location || "City Center",
      priority: formData.priority || "Medium",
      status: "New",
      age: 0,
      assigned: "Unassigned",
      score: formData.priority === "High" ? 90 : formData.priority === "Medium" ? 75 : 55,
      time: "Just now",
      description: formData.description,
      anonymous: !!formData.anonymous,
      created_by: creatorName,
      created_by_email: creatorEmail,
      created_at: new Date().toISOString(),
      photo_url: formData.photo || null,
      image_verification: formData.imageVerification || null,
    };
  }

  const all = getAllComplaints();
  const updated = [savedComplaint, ...all.filter(c => c.id !== savedComplaint.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return savedComplaint;
}
