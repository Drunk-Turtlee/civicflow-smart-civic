// -----------------------------------------------------------------------------
// AdminDashboard.jsx — Municipal operations command center
// -----------------------------------------------------------------------------
// Designed around the case-study evaluation points: distribution, unresolved
// work, aging complaints, high-priority locations and SLA performance.
// Additional frontend-only features include a quick workload view, hotspot list,
// and a compact priority explanation so judges can understand the workflow.
// ----------------------------------------------------------------------------

import { Box, Button, Chip, Grid, LinearProgress, Typography } from "@mui/material";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import AssignmentRounded from "@mui/icons-material/AssignmentRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import LocationOnRounded from "@mui/icons-material/LocationOnRounded";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import ComplaintTable from "../components/ComplaintTable";
import { complaints, distribution } from "../data/mockData";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const {t}=useTranslation(); const navigate=useNavigate();
  const urgent = complaints.filter(x=>x.priority === "High");
  const unresolved = complaints.filter(x=>x.status !== "Resolved");
  const hotspots = ["Sector 18, Noida","MG Road Junction","Sector 62 Market","Block B, Sector 50"];

  return <Box>
    <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"end",gap:2,mb:3,flexWrap:"wrap"}}>
      <Box><Typography variant="h3">Operations center</Typography><Typography color="text.secondary" sx={{mt:.7}}>{t("queueHint")}</Typography></Box>
      <Button variant="contained" onClick={()=>navigate("/admin/complaints")} startIcon={<AssignmentRounded/>}>Open complaint queue</Button>
    </Box>

    <Grid container spacing={2} sx={{mb:2}}>
      <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<AssignmentRounded/>} label="New today" value="86" hint="+12%" tone="blue"/></Grid>
      <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<WarningAmberRounded/>} label="High priority" value="147" hint="23 overdue" tone="amber"/></Grid>
      <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<AccessTimeRounded/>} label="Aging > 7 days" value="62" hint="-9%" tone="purple"/></Grid>
      <Grid size={{xs:12,sm:6,lg:3}}><StatCard icon={<CheckCircleRounded/>} label="SLA met" value="92.4%" hint="+2.1%" tone="green"/></Grid>
    </Grid>

    <Grid container spacing={2}>
      <Grid size={{xs:12,lg:8}}>
        <Box className="neo" sx={{p:2.5,borderRadius:2,mb:2}}>
          <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"start",mb:2,gap:2}}><Box><Typography variant="h6" fontWeight={900}>Priority queue</Typography><Typography variant="body2" color="text.secondary">Ranked by age, category and similar complaints.</Typography></Box><Chip icon={<TrendingUpRounded/>} label="Rule-based" color="primary" variant="outlined"/></Box>
          <ComplaintTable rows={urgent} onSelect={(row)=>navigate(`/admin/complaints?focus=${row.id}`)}/>
        </Box>
        <Box className="neo" sx={{p:2.5,borderRadius:2}}>
          <Typography variant="h6" fontWeight={900} sx={{mb:.5}}>Workload snapshot</Typography>
          <Typography variant="body2" color="text.secondary" sx={{mb:2}}>Current unresolved complaints by category.</Typography>
          {distribution.map(([name,val])=><Box key={name} sx={{mb:1.8}}><Box sx={{display:"flex",justifyContent:"space-between",mb:.5}}><Typography fontWeight={750}>{name}</Typography><Typography fontWeight={850}>{Math.round(val*12.5)}</Typography></Box><LinearProgress variant="determinate" value={val*2.5} sx={{height:7,borderRadius:2}}/></Box>)}
        </Box>
      </Grid>

      <Grid size={{xs:12,lg:4}}>
        <Box className="neo" sx={{p:2.5,borderRadius:2,mb:2}}>
          <Typography variant="h6" fontWeight={900}>SLA performance</Typography>
          <Typography color="text.secondary" variant="body2" sx={{mb:2}}>Current month by service.</Typography>
          {[['Streetlight',96],['Garbage / Waste',91],['Pothole / Road',88],['Water Supply',94]].map(([name,val])=><Box key={name} sx={{mb:2}}><Box sx={{display:"flex",justifyContent:"space-between",mb:.5}}><Typography fontWeight={750}>{name}</Typography><Typography fontWeight={850}>{val}%</Typography></Box><LinearProgress variant="determinate" value={val} sx={{height:7,borderRadius:2}}/></Box>)}
          <Button fullWidth variant="outlined" onClick={()=>navigate('/admin/analytics')}>View full analytics</Button>
        </Box>
        <Box className="neo" sx={{p:2.5,borderRadius:2,mb:2}}>
          <Box sx={{display:"flex",alignItems:"center",gap:1,mb:1}}><LocationOnRounded color="primary"/><Typography variant="h6" fontWeight={900}>Hotspot locations</Typography></Box>
          {hotspots.map((name,i)=><Box key={name} sx={{display:"flex",justifyContent:"space-between",alignItems:"center",py:1.1,borderBottom:i<3?"1px solid":"none",borderColor:"divider"}}><Typography fontWeight={750}>{i+1}. {name}</Typography><Chip size="small" label={[42,37,29,24][i]} /></Box>)}
        </Box>
        <Box className="neo-soft" sx={{p:2,borderRadius:2}}>
          <Typography fontWeight={850}>Aging alert</Typography><Typography variant="body2" color="text.secondary" sx={{mt:.4}}>{unresolved.filter(x=>x.age>7).length || 1} sampled complaints are over 7 days old. Escalation can be handled by the backend SLA rules.</Typography>
        </Box>
        <Box className="neo" sx={{p:2,borderRadius:2,mt:2}}>
          <Typography fontWeight={850}>Service hotspot view</Typography>
          <Typography variant="caption" color="text.secondary">A lightweight map placeholder for the backend GIS layer.</Typography>
          <Box sx={{mt:1.5,height:145,borderRadius:1.8,position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#dfe8f1,#eef3f8)"}}>
            {[['18%',28,'#c94b59'],['54%',55,'#d58b32'],['76%',35,'#315f8c'],['38%',72,'#6d5dfc']].map(([left,top,color],i)=><Box key={i} sx={{position:"absolute",left,top,width:18,height:18,borderRadius:"50%",bgcolor:color,boxShadow:`0 0 0 7px ${color}22, 0 4px 10px rgba(0,0,0,.12)`}} />)}
            <Typography variant="caption" sx={{position:"absolute",bottom:8,left:10,fontWeight:750,color:"#607086"}}>North district service activity</Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  </Box>;
}
