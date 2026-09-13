// -----------------------------------------------------------------------------
// CitizenDashboard.jsx — Citizen home
// -----------------------------------------------------------------------------
// This page is a dashboard/overview, not the source of truth for complaint data.
//
// The current numbers and complaints come from mockData.js.
// When the API is connected, load the data from the backend and pass it into the
// existing visual components.
//
// Keeping the dashboard separate from API code makes the UI easier to maintain.
// -----------------------------------------------------------------------------

import { useState } from "react";
import { Box, Button, Grid, Typography, Paper } from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import TrackChangesRounded from "@mui/icons-material/TrackChangesRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StatCard from "../components/StatCard";
import ComplaintTable from "../components/ComplaintTable";
import ComplaintDetail from "../components/ComplaintDetail";
import { complaints, stats } from "../data/mockData";
import { useTranslation } from "react-i18next";

export default function CitizenDashboard() {
  const {t}=useTranslation(); const navigate=useNavigate(); const [selected,setSelected]=useState(null);
  if(selected) return <ComplaintDetail complaint={selected} onBack={()=>setSelected(null)} />;
  return (
    <Box>
      <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:2,mb:3,flexWrap:"wrap"}}>
        <Box><Typography variant="h3">{t("welcome")} 👋</Typography><Typography color="text.secondary" sx={{mt:.7}}>{t("overview")}</Typography></Box>
        <Button variant="contained" size="large" startIcon={<AddRounded/>} onClick={()=>navigate("/citizen/report")} sx={{borderRadius:2,px:2.5,boxShadow:"0 10px 24px rgba(49,95,140,.22)"}}>{t("newComplaint")}</Button>
      </Box>
      <Grid container spacing={2} sx={{mb:3}}>
        <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<TrackChangesRounded/>} label={t("active")} value={stats.active} hint="+8.4%" tone="blue"/></Grid>
        <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<CheckCircleRounded/>} label={t("resolved")} value={stats.resolved} hint="92% SLA" tone="green"/></Grid>
        <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<WarningAmberRounded/>} label={t("urgent")} value={stats.urgent} hint="Needs action" tone="amber"/></Grid>
        <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<AccessTimeRounded/>} label={t("response")} value={stats.response} hint="-14m" tone="purple"/></Grid>
      </Grid>

      <Grid container spacing={2} sx={{mb:3}}>
        <Grid size={{xs:12,lg:7}}>
          <Box className="neo" sx={{p:2.5,borderRadius:2.5,height:"100%"}}>
            <Box sx={{display:"flex",justifyContent:"space-between",mb:2}}><Box><Typography variant="h6" fontWeight={900}>{t("recent")}</Typography><Typography variant="body2" color="text.secondary">Your latest civic reports</Typography></Box><Button onClick={()=>navigate("/citizen/complaints")}>{t("viewAll")}</Button></Box>
            <ComplaintTable rows={complaints.slice(0,3)} onSelect={setSelected}/>
          </Box>
        </Grid>
        <Grid size={{xs:12,lg:5}}>
          <Box className="neo" sx={{p:2.5,borderRadius:2.5,height:"100%"}}>
            <Typography variant="h6" fontWeight={900}>{t("track")}</Typography>
            <Typography color="text.secondary" sx={{mb:2}}>CIV-2026-1048</Typography>
            <Box className="neo-inset" sx={{p:2,borderRadius:3}}>
              {["New","Assigned","In Progress","Resolved"].map((s,i)=><Box key={s} sx={{display:"flex",alignItems:"center",gap:1.5,mb:i===3?0:2}}>
                <Box sx={{width:12,height:12,borderRadius:"50%",bgcolor:i<3?"#315f8c":"#cfd7e2",boxShadow:i<3?"0 0 0 5px #e1e8f0":"none"}}/>
                <Box><Typography fontWeight={800}>{s}</Typography><Typography variant="caption" color="text.secondary">{i===2?"Team is working on it":i<2?"Completed": "Pending"}</Typography></Box>
              </Box>)}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}