# CivicFlow AI Municipal PDF Reports

## What it does

The admin Analytics page can generate a professional PDF report from the selected period.

The backend gets the verified analytics from MongoDB Atlas, sends only those analytics to Gemini for interpretation, and then builds the PDF locally with ReportLab.

The Gemini API key is never exposed to the React frontend.

## Environment

Create `smart-civic-backend/.env` from `.env.example` and set:

```env
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-2.5-flash
```

Also set your existing MongoDB values.

## API

```text
POST /api/reports/generate?period=daily
POST /api/reports/generate?period=weekly
POST /api/reports/generate?period=half-monthly
POST /api/reports/generate?period=monthly
```

The endpoint returns an `application/pdf` attachment.

## Frontend

On `/admin/analytics`, choose a period and click **Generate AI Report**. The PDF downloads automatically.

## Data integrity

MongoDB remains the source of truth for numerical values. Gemini is instructed to interpret the verified analytics and does not provide official KPI numbers.
