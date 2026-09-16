// -----------------------------------------------------------------------------
// mockData.js — Temporary frontend-only demonstration data
// -----------------------------------------------------------------------------
// THIS FILE IS EXPECTED TO BE REPLACED/DECOUPLED WHEN THE BACKEND IS READY.
//
// It exists so the frontend can:
//   - run without FastAPI
//   - demonstrate the complete UI
//   - be reviewed by judges
//   - be developed independently by the frontend team
//
// Do not put production business rules here.
// The priority `score` is only sample display data; the backend should eventually
// calculate the authoritative score from age, category and similar complaints.
// -----------------------------------------------------------------------------

// Sample complaints used only to make the prototype immediately usable.
export const complaints = [
  { id:"CIV-2026-1048", title:"Streetlight not working near Gate 3", category:"Other", custom_category:"Streetlight", location:"Sector 18, Noida", priority:"High", status:"In Progress", age:6, assigned:"Ravi Kumar", score:92, time:"Today, 9:42 AM", description:"There has been no street light near Gate 3 for almost a week and the road gets extremely dark." },
  { id:"CIV-2026-1047", title:"Large pothole causing traffic slowdown", category:"Pothole", location:"MG Road Junction", priority:"High", status:"Assigned", age:3, assigned:"Roads Team A", score:86, time:"Today, 8:15 AM", description:"Deep pothole on the left lane near the signal. Two-wheelers are struggling to pass." },
  { id:"CIV-2026-1046", title:"Garbage not collected for 3 days", category:"Garbage", location:"Sector 62 Market", priority:"Medium", status:"New", age:3, assigned:"Unassigned", score:74, time:"Yesterday, 6:30 PM", description:"The community bins are overflowing and garbage has not been collected since Monday." },
  { id:"CIV-2026-1045", title:"Low water pressure in Block B", category:"Other", custom_category:"Water Supply", location:"Block B, Sector 50", priority:"Medium", status:"In Progress", age:8, assigned:"Water Works 2", score:78, time:"Yesterday, 10:18 AM", description:"Water pressure has been very low every morning for more than a week." },
  { id:"CIV-2026-1044", title:"Open drain cover beside school", category:"Other", custom_category:"Drainage", location:"Saraswati School Road", priority:"High", status:"Resolved", age:12, assigned:"Civic Safety Team", score:96, time:"2 days ago", description:"A drain cover is missing beside the school entrance." }
];

export const stats = {
  active: 1284,
  resolved: 3462,
  urgent: 147,
  response: "2h 18m"
};

export const distribution = [
  ["Garbage", 34],
  ["Road Damage", 24],
  ["Pothole", 19],
  ["Other", 23]
];
