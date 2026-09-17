# TEAM GUIDE — CivicFlow Frontend

## 1. What this repository is

This is the FRONTEND ONLY for the Smart Civic Complaint & Issue Management System.

The frontend is intentionally independent from FastAPI and MongoDB.
At the moment it uses mock data so the UI can be developed and demonstrated before
the backend is connected.

The backend team can replace the mock data/service calls later without redesigning
the pages.

## 2. Folder structure

```text
src/
├── components/
│   ├── AppShell.jsx             # Main sidebar/top navigation
│   ├── ComplaintDetail.jsx      # Full complaint details + status timeline
│   ├── ComplaintTable.jsx       # Reusable complaint table
│   ├── LanguageSwitcher.jsx     # Indian-language selector
│   ├── StatCard.jsx             # Reusable KPI card
│   └── StatusChip.jsx            # New/Assigned/In Progress/Resolved chip
│
├── data/
│   └── mockData.js              # Temporary frontend demo data
│
├── i18n/
│   └── i18n.js                  # Translation configuration
│
├── pages/
│   ├── AdminDashboard.jsx       # Municipal operations dashboard
│   ├── AnalyticsPage.jsx        # Analytics screens
│   ├── CitizenDashboard.jsx     # Citizen home/dashboard
│   ├── ComplaintsPage.jsx       # Citizen/admin complaint list
│   ├── ReportComplaint.jsx      # Complaint submission form
│   └── SettingsPage.jsx         # Language/preferences
│
├── App.jsx                      # Routes/pages
├── main.jsx                     # React application entry point
└── index.css                    # Global styles + neomorphism helpers
```

## 3. Important rule for the team

Do NOT put API requests directly into every UI component.

When the backend is ready, create a service layer such as:

```text
src/services/
├── complaintService.js
└── analyticsService.js
```

Then pages/components call the service functions.

Example:

```js
// complaintService.js
export async function getComplaints() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/complaints`);
  if (!response.ok) throw new Error("Failed to load complaints");
  return response.json();
}
```

This keeps the UI clean and makes backend changes easier.

## 4. Expected backend mapping

The supplied case study says FastAPI handles:
- complaint submission
- assignment
- status management
- comments
- analytics

A sensible frontend mapping is:

```text
POST   /complaints
GET    /complaints
GET    /complaints/{id}
PATCH  /complaints/{id}/assign
PATCH  /complaints/{id}/status
POST   /complaints/{id}/comments
GET    /analytics/summary
```

The exact endpoints should follow whatever the backend team implements.

## 5. Mock data

`src/data/mockData.js` is temporary.

Do not build business logic around the sample values.

The sample complaint objects intentionally contain:

```text
id
title
category
location
priority
status
age
assigned
score
time
description
```

If the backend uses different field names, normalize the response in the service layer
rather than changing every UI component.

## 6. Status workflow

The UI uses exactly this case-study flow:

New
  ↓
Assigned
  ↓
In Progress
  ↓
Resolved

`StatusChip.jsx` controls the visual treatment.

`ComplaintDetail.jsx` controls the timeline.

When the API is connected, the status selector should call the backend and then update
the local UI state after a successful response.

## 7. Rule-based priority

The case study requires prioritization based on:
- complaint age
- issue category
- number of similar complaints

The frontend does NOT calculate the official priority score.

It only displays the value supplied by the backend/mock data.

This is intentional: business rules belong in the backend.

## 8. AI / Smart Assist

The case study makes AI optional.

The frontend contains a "Smart assist" entry point but does not pretend an AI service
already exists.

When the backend adds AI, connect that button to the team's AI endpoint.

Possible returned fields:

```text
category
urgency
summary
location
```

The frontend can then show a review card before the citizen submits the complaint.

## 9. Languages

The translation system uses i18next.

Currently included:
- English
- Hindi
- Bengali
- Marathi
- Tamil
- Telugu
- Kannada
- Malayalam
- Gujarati
- Punjabi

To add another language:

1. Add its resource object inside `src/i18n/i18n.js`.
2. Give it the language code.
3. Add the language to the `languages` array in `LanguageSwitcher.jsx`.
4. Keep translation keys consistent with English.

Example:

```js
{
  translation: {
    dashboard: "..."
  }
}
```

## 10. Design system

The project intentionally combines:

### Material Design
Used for:
- forms
- buttons
- navigation
- tables
- chips
- selects
- alerts
- switches

### Neomorphism
Used for:
- KPI cards
- large content cards
- inset fields
- secondary surfaces

The global classes are in `src/index.css`:

```text
.neo
.neo-inset
.neo-soft
```

Use these classes instead of inventing a new shadow system for every component.

## 11. If you change a component

Before changing a component, check whether it is reused.

For example:
- `ComplaintTable` is used by both citizen and admin pages.
- `StatusChip` is shared by complaint views.
- `AppShell` controls the complete navigation experience.
- `LanguageSwitcher` is intentionally reusable.

Prefer adding props over duplicating components.

## 12. Running the project

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## 13. Environment variable

`.env.example` contains:

```text
VITE_API_URL=http://localhost:8000
```

After the backend is available, copy it to `.env` and change the URL if required.

Do not commit `.env` if it contains private credentials.

## 14. Backend integration checklist

- [ ] Create API service layer
- [ ] Replace mock complaint list
- [ ] Connect complaint submission
- [ ] Connect complaint detail
- [ ] Connect assignment
- [ ] Connect status updates
- [ ] Connect comments
- [ ] Connect analytics
- [ ] Connect real priority score
- [ ] Connect optional AI Smart Assist
- [ ] Add loading states
- [ ] Add API error states
- [ ] Add authentication when backend auth is ready
- [ ] Test all Indian-language screens
- [ ] Test mobile layout


## 15. If the browser shows a blank page

A blank page with the browser title still visible usually means the HTML loaded but
React crashed before rendering.

The project now includes `ErrorBoundary.jsx`, which should show a visible error
card instead of a completely blank screen.

If troubleshooting is still necessary:

1. Open the page.
2. Press `F12`.
3. Open **Console**.
4. Look for the first red error.
5. Fix that error before investigating styling.

Also run:

```bash
npm run build
```

Vite will report JSX/import/module errors directly in the terminal.

Do not randomly rewrite the UI to fix a blank page. First identify the actual
JavaScript/module error.


### The blank-page issue that was fixed

The original blank page was caused by Vite not loading the React JSX plugin.
The browser console reported:

```text
ReferenceError: React is not defined
at App (App.jsx)
```

`vite.config.js` now explicitly enables `@vitejs/plugin-react`.

Do not remove the React plugin unless the build system is intentionally replaced.


## 16. Visual design rules

The UI intentionally uses **restrained neomorphism**, not extreme rounded "bubble"
components.

- Main panels: approximately 20–22px radius.
- Smaller cards: approximately 16–18px radius.
- Inputs/selects: approximately 14–16px radius.
- Navigation/buttons: approximately 10–14px radius.
- Only ONE global language selector is shown in the top-right header.
- Avoid adding another language selector to the sidebar.
- The complaint description textarea should stay rectangular/soft-cornered, not pill-shaped.

If a new component is added, match these proportions rather than automatically using
a very large `borderRadius`.

## 17. New frontend features in the enhanced prototype

### Theme
Light/dark mode is handled by `src/theme/ThemeModeContext.jsx` and persisted in
localStorage. It is a UI preference; the backend does not need to implement it.

### Notifications
`NotificationCenter.jsx` is a visual inbox. Replace its local notification array
with a notifications API when the backend is ready.

### Complaint filters
`ComplaintsPage.jsx` supports search, status, priority, category and sorting. When
there are many records, move these filters to FastAPI query parameters rather than
loading the entire dataset into the browser.

### Smart Assist
`SmartAssistCard.jsx` demonstrates the optional AI requirement. The deterministic
prototype is deliberately easy to replace with a POST request to an AI endpoint.

### Location
The report form can request browser GPS permission. The backend can later reverse-
geocode coordinates into a street/area and store the coordinates separately.

### Photos
The report form previews one selected image locally. The backend should accept the
actual multipart upload and return a stable attachment URL.

### Drafts
Unfinished complaint form data is saved locally under `civicflow-complaint-draft`.
Do not treat this as the source of truth; server-side drafts can be added later.

### Analytics / hotspot view
The admin dashboard includes a lightweight visual hotspot placeholder. If the team
adds a real map provider, keep the map in its own component and feed it backend
coordinates instead of mixing GIS logic into the dashboard page.

## Final frontend handoff notes

- This folder is frontend-only and uses mock data until the FastAPI team connects services.
- The React Vite plugin is required; do not remove it.
- The citizen dashboard uses `ConstructionRounded` for the road service shortcut.
- Only the top-right global language selector should be used; do not add a duplicate sidebar selector.
- Keep neomorphism restrained: large surfaces use moderate corners, forms are not pill-shaped.
- `RUN-CIVICFLOW.bat` can install dependencies on the first run and start Vite on Windows.
