// -----------------------------------------------------------------------------
// SmartAssistCard.jsx — Optional AI-ready complaint assistance
// -----------------------------------------------------------------------------
// The case study explicitly makes AI optional. This component therefore behaves
// like a realistic frontend integration point without pretending that an LLM is
// already connected.
//
// Current demo behavior:
//   description -> deterministic suggestions
//
// Future backend behavior:
//   POST /ai/classify -> { category, urgency, summary, location }
// -----------------------------------------------------------------------------

import { useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Typography } from "@mui/material";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";

export default function SmartAssistCard({ description, onApply }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = () => {
    setLoading(true);
    // Simulates network latency so the prototype demonstrates a proper loading state.
    setTimeout(() => {
      const text = description.toLowerCase();
      const category = text.includes("pothole") ? "Pothole" : text.includes("road") ? "Road Damage" : text.includes("garbage") || text.includes("waste") ? "Garbage" : "Other";
      const urgency = text.includes("danger") || text.includes("accident") || text.includes("school") ? "High" : text.includes("week") || text.includes("days") ? "Medium" : "Low";
      const summary = description.trim().length > 110 ? `${description.trim().slice(0, 107)}...` : description.trim();
      setResult({ category, urgency, summary });
      setLoading(false);
    }, 650);
  };

  return (
    <Box className="neo-soft" sx={{ mt: 1.5, p: 1.7, borderRadius: 2 }}>
      <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:1, flexWrap:"wrap" }}>
        <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
          <AutoAwesomeRounded sx={{ color:"secondary.main" }} />
          <Box>
            <Typography fontWeight={850}>Smart Assist</Typography>
            <Typography variant="caption" color="text.secondary">Suggest category, urgency and a concise summary.</Typography>
          </Box>
        </Box>
        <Button size="small" variant="contained" disabled={!description.trim() || loading} onClick={analyze} startIcon={loading ? <CircularProgress size={15} color="inherit" /> : <AutoAwesomeRounded />}>
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </Box>
      {result && (
        <Alert severity="info" sx={{ mt: 1.5, borderRadius: 1.5 }}>
          <Box sx={{ display:"flex", gap:.7, flexWrap:"wrap", mb:.6 }}>
            <Chip size="small" label={`Category: ${result.category}`} />
            <Chip size="small" label={`Urgency: ${result.urgency}`} />
          </Box>
          <Typography variant="body2"><strong>Summary:</strong> {result.summary}</Typography>
          <Button size="small" sx={{ mt:.7 }} onClick={() => onApply?.(result)}>Apply suggestions</Button>
        </Alert>
      )}
    </Box>
  );
}
