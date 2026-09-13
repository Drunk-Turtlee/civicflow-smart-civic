// -----------------------------------------------------------------------------
// CitizenDashboard.jsx — Citizen home and quick status overview
// -----------------------------------------------------------------------------
// Enhancements over the basic prototype:
//   - quick actions
//   - notification-style status banner
//   - complaint progress tracker
//   - small service category shortcuts
//   - recent complaints with details
// -----------------------------------------------------------------------------

import { useState } from "react";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import TrackChangesRounded from "@mui/icons-material/TrackChangesRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import LightbulbOutlined from "@mui/icons-material/LightbulbOutlined";
import WaterDropOutlined from "@mui/icons-material/WaterDropOutlined";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import ConstructionRounded from "@mui/icons-material/ConstructionRounded";
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
  const services=[['Streetlight',<LightbulbOutlined/>],['Pothole / Road',<ConstructionRounded/>],['Garbage / Waste',<DeleteOutlineRounded/>],['Water Supply',<WaterDropOutlined/>]];
  const tracked=complaints[0];
  const steps=['New','Assigned','In Progress','Resolved']; const active=steps.indexOf(tracked.status);
  return <Box>
    <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:2,mb:3,flexWrap:"wrap"}}>
      <Box><Typography variant="h3">{t("welcome")} 👋</Typography><Typography color="text.secondary" sx={{mt:.7}}>{t("overview")}</Typography></Box>
      <Button variant="contained" size="large" startIcon={<AddRounded/>} onClick={()=>navigate("/citizen/report")} sx={{borderRadius:1.5,px:2.5,boxShadow:"0 10px 24px rgba(49,95,140,.22)"}}>{t("newComplaint")}</Button>
    </Box>

    <Box className="neo-soft" sx={{p:1.5,borderRadius:1.8,mb:2,display:"flex",alignItems:"center",gap:1.2,flexWrap:"wrap"}}>
      <CheckCircleRounded color="success"/><Box sx={{flex:1}}><Typography fontWeight={800}>Your latest report is being handled</Typography><Typography variant="body2" color="text.secondary">CIV-2026-1048 • Streetlight • Team is working on it</Typography></Box><Button size="small" endIcon={<ArrowForwardRounded/>} onClick={()=>setSelected(tracked)}>View status</Button>
    </Box>

    <Grid container spacing={2} sx={{mb:2}}>
      <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<TrackChangesRounded/>} label={t("active")} value={stats.active} hint="+8.4%" tone="blue"/></Grid>
      <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<CheckCircleRounded/>} label={t("resolved")} value={stats.resolved} hint="92% SLA" tone="green"/></Grid>
      <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<WarningAmberRounded/>} label={t("urgent")} value={stats.urgent} hint="Needs action" tone="amber"/></Grid>
      <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<AccessTimeRounded/>} label={t("response")} value={stats.response} hint="-14m" tone="purple"/></Grid>
    </Grid>

    <Box sx={{mb:2}}><Typography variant="subtitle1" fontWeight={900} sx={{mb:1}}>Report by service</Typography><Grid container spacing={1.2}>{services.map(([name,icon])=><Grid key={name} size={{xs:6,sm:3}}><motion.div whileHover={{y:-2}}><Button fullWidth onClick={()=>navigate('/citizen/report')} className="neo-soft" sx={{justifyContent:"flex-start",gap:1.2,p:1.4,borderRadius:1.8,color:"text.primary"}}>{icon}<Typography fontWeight={750} noWrap>{name}</Typography></Button></motion.div></Grid>)}</Grid></Box>

    <Grid container spacing={2} sx={{mb:2}}>
      <Grid size={{xs:12,lg:7}}><Box className="neo" sx={{p:2.5,borderRadius:2,height:"100%"}}><Box sx={{display:"flex",justifyContent:"space-between",mb:2}}><Box><Typography variant="h6" fontWeight={900}>{t("recent")}</Typography><Typography variant="body2" color="text.secondary">Your latest civic reports</Typography></Box><Button onClick={()=>navigate('/citizen/complaints')}>{t("viewAll")}</Button></Box><ComplaintTable rows={complaints.slice(0,3)} onSelect={setSelected}/></Box></Grid>
      <Grid size={{xs:12,lg:5}}><Box className="neo" sx={{p:2.5,borderRadius:2,height:"100%"}}><Box sx={{display:"flex",justifyContent:"space-between",alignItems:"start"}}><Box><Typography variant="h6" fontWeight={900}>{t("track")}</Typography><Typography color="text.secondary">{tracked.id}</Typography></Box><Chip label={tracked.priority} size="small" /></Box><Box className="neo-inset" sx={{p:2,mt:2,borderRadius:1.8}}>{steps.map((step,i)=><Box key={step} sx={{display:"flex",alignItems:"flex-start",gap:1.3,position:"relative",pb:i===3?0:2}}>{i<3&&<Box sx={{position:"absolute",left:5,top:13,bottom:0,width:2,bgcolor:i<active?"primary.main":"divider"}}/>}<Box sx={{zIndex:1,width:12,height:12,borderRadius:"50%",bgcolor:i<=active?"primary.main":"action.disabledBackground",mt:.3}}/><Box><Typography fontWeight={800}>{step}</Typography><Typography variant="caption" color="text.secondary">{i<active?"Completed":i===active?"Team is working on it":"Pending"}</Typography></Box></Box>)}</Box></Box></Grid>
    </Grid>
  </Box>;
}
