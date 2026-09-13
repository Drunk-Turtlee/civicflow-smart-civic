# CivicFlow — Smart Civic Complaint & Issue Management Frontend

React + Vite frontend for the DPA Hackathon 2026 Smart Civic Complaint & Issue Management System.

## Scope

This repository is **frontend only**. It intentionally uses local mock data so the backend team can later replace the data layer with FastAPI endpoints.

Implemented UI:
- Citizen dashboard
- Complaint submission form
- Complaint tracking
- My complaints / searchable complaint list
- Municipal admin operations dashboard
- Admin complaint queue
- Complaint status timeline: New → Assigned → In Progress → Resolved
- Admin status update + comment UI
- Analytics: issue distribution, aging complaints, high-priority locations and SLA performance
- Rule-prioritization score shown in complaint data
- Responsive desktop/tablet/mobile layout
- Material Design components via MUI
- Neomorphic surfaces and inset controls
- Indian-language interface switching:
  English, हिन्दी, বাংলা, मराठी, தமிழ், తెలుగు, ಕನ್ನಡ, മലയാളം, ગુજરાતી, ਪੰਜਾਬੀ

## Run

Requirements: Node.js 20+ recommended.

```bash
npm install
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173).

## Admin preview

Open:
- `/admin` — municipal operations dashboard
- `/admin/complaints` — operations queue
- `/admin/analytics` — analytics

## Backend handoff

Keep the UI and replace the mock data/service layer with FastAPI calls.

Suggested API mapping:
- POST `/complaints`
- GET `/complaints`
- GET `/complaints/{id}`
- PATCH `/complaints/{id}/assign`
- PATCH `/complaints/{id}/status`
- POST `/complaints/{id}/comments`
- GET `/analytics/summary`

Do not redesign the screens when integrating the API; bind the existing components to the API response models.

## Design direction

The visual system deliberately combines:
- Material Design for forms, navigation, data tables, chips and accessible interaction patterns.
- Neomorphism for cards, KPI tiles, inset fields and secondary surfaces.
- Restrained blue/purple accent usage so the product feels like a serious municipal service rather than a flashy AI demo.

## Case-study alignment

The UI directly reflects the supplied case study requirements: category, description, location, priority, complaint queues, status flow, comments, analytics, aging, high-priority locations and SLA performance. The optional AI idea is represented as a **Smart assist** entry point without pretending that an AI backend exists yet.
