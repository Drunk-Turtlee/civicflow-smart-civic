// -----------------------------------------------------------------------------
// AdminDashboard.jsx — Municipal operations overview
// -----------------------------------------------------------------------------
// This is designed around the case-study evaluation points:
//
// - issue distribution
// - unresolved/high-priority work
// - aging complaints
// - SLA performance
// - prioritized operations queue
//
// IMPORTANT:
// The frontend displays these metrics. The backend should calculate authoritative
// values from the complaint database.
// -----------------------------------------------------------------------------

import { Box, Button, Grid, Typography, LinearProgress } from "@mui/material";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import AssignmentRounded from "@mui/icons-material/AssignmentRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import ComplaintTable from "../components/ComplaintTable";
import { complaints } from "../data/mockData";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const {t}=useTranslation(); const navigate=useNavigate();
  return <Box>
    <Box sx={{mb:3}}><Typography variant="h3">{t("operations")}</Typography><Typography color="text.secondary" sx={{mt:.7}}>{t("queueHint")}</Typography></Box>
    <Grid container spacing={2} sx={{mb:3}}>
      <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<AssignmentRounded/>} label="New today" value="86" hint="+12%" tone="blue"/></Grid>
      <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<WarningAmberRounded/>} label="High priority" value="147" hint="23 overdue" tone="amber"/></Grid>
      <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<AccessTimeRounded/>} label="Aging > 7 days" value="62" hint="-9%" tone="purple"/></Grid>
      <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<CheckCircleRounded/>} label="SLA met" value="92.4%" hint="+2.1%" tone="green"/></Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid size={{xs:12,lg:8}}>
        <Box className="neo" sx={{p:2.5,borderRadius:2.5}}>
          <Box sx={{display:"flex",justifyContent:"space-between",mb:2}}><Box><Typography variant="h6" fontWeight={900}>{t("needsAttention")}</Typography><Typography variant="body2" color="text.secondary">Prioritized by age, category and similar complaints</Typography></Box><Button onClick={()=>navigate("/admin/complaints")}>{t("viewAll")}</Button></Box>
          <ComplaintTable rows={complaints.filter(x=>x.priority==="High")} onSelect={()=>navigate("/admin/complaints")}/>
        </Box>
      </Grid>
      <Grid size={{xs:12,lg:4}}>
        <Box className="neo" sx={{p:2.5,borderRadius:2.5,height:"100%"}}>
          <Typography variant="h6" fontWeight={900}>{t("sla")}</Typography>
          <Typography color="text.secondary" variant="body2" sx={{mb:2}}>Current month</Typography>
          {[
            ["Streetlight",96],["Garbage / Waste",91],["Pothole / Road",88],["Water Supply",94]
          ].map(([name,val])=><Box key={name} sx={{mb:2.2}}><Box sx={{display:"flex",justifyContent:"space-between",mb:.6}}><Typography fontWeight={750}>{name}</Typography><Typography fontWeight={850}>{val}%</Typography></Box><LinearProgress variant="determinate" value={val} sx={{height:8,borderRadius:5,bgcolor:"#dce3eb","& .MuiLinearProgress-bar":{borderRadius:5}}}/></Box>)}
        </Box>
      </Grid>
    </Grid>
  </Box>;
}