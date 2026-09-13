// -----------------------------------------------------------------------------
// AnalyticsPage.jsx — Municipal analytics and hotspot visualization
// -----------------------------------------------------------------------------
// The visualizations are intentionally dependency-light so the backend team can
// later feed real API results into the same components.
// ----------------------------------------------------------------------------

import { Box, Chip, Grid, Typography } from "@mui/material";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import LocationOnRounded from "@mui/icons-material/LocationOnRounded";
import SpeedRounded from "@mui/icons-material/SpeedRounded";
import { distribution } from "../data/mockData";
import { useTranslation } from "react-i18next";

export default function AnalyticsPage() {
  const {t}=useTranslation(); const max=Math.max(...distribution.map(x=>x[1]));
  const hotspots=[['Sector 18, Noida',42,'Streetlight'],['MG Road Junction',37,'Pothole / Road'],['Sector 62 Market',29,'Garbage / Waste'],['Block B, Sector 50',24,'Water Supply']];
  const trend=[34,39,42,38,47,53,49,61,58,66,72,68];
  return <Box>
    <Box sx={{mb:3}}><Typography variant="h3">{t("analytics")}</Typography><Typography color="text.secondary">Operational intelligence for municipal teams.</Typography></Box>
    <Grid container spacing={2}>
      <Grid size={{xs:12,md:7}}><Box className="neo" sx={{p:3,borderRadius:2}}><Box sx={{display:"flex",justifyContent:"space-between",mb:3}}><Box><Typography variant="h6" fontWeight={900}>{t("issueDistribution")}</Typography><Typography variant="body2" color="text.secondary">Share of complaints by category</Typography></Box><Chip label="Current month" variant="outlined"/></Box>{distribution.map(([name,val])=><Box key={name} sx={{mb:2.3}}><Box sx={{display:"flex",justifyContent:"space-between",mb:.6}}><Typography fontWeight={750}>{name}</Typography><Typography fontWeight={850}>{val}%</Typography></Box><Box sx={{height:10,borderRadius:2}} className="neo-inset"><Box sx={{height:"100%",width:`${(val/max)*100}%`,borderRadius:2,background:"linear-gradient(90deg,#315f8c,#6d5dfc)"}}/></Box></Box>)}</Box></Grid>
      <Grid size={{xs:12,md:5}}><Box className="neo" sx={{p:3,borderRadius:2,height:"100%"}}><Typography variant="h6" fontWeight={900}>{t("aging")}</Typography><Typography variant="body2" color="text.secondary" sx={{mb:2}}>Unresolved complaint age</Typography>{[['0–2 days',38],['3–7 days',31],['8–14 days',21],['>14 days',10]].map(([x,v])=><Box key={x} sx={{display:"flex",justifyContent:"space-between",p:1.5,mb:1,borderRadius:1.5}} className="neo-soft"><Typography fontWeight={750}>{x}</Typography><Typography fontWeight={900}>{v}%</Typography></Box>)}<Box sx={{display:"flex",alignItems:"center",gap:1,mt:2}}><SpeedRounded color="success"/><Typography variant="body2" color="text.secondary">92.4% of sampled complaints are within SLA.</Typography></Box></Box></Grid>
      <Grid size={12}><Box className="neo" sx={{p:3,borderRadius:2}}><Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",mb:2}}><Box><Typography variant="h6" fontWeight={900}>Complaint trend</Typography><Typography variant="body2" color="text.secondary">Last 12 reporting periods</Typography></Box><Chip icon={<TrendingUpRounded/>} label="+18%" color="success" variant="outlined"/></Box><Box sx={{height:150,display:"flex",alignItems:"end",gap:.8}}>{trend.map((v,i)=><Box key={i} sx={{flex:1,height:`${(v/72)*100}%`,minWidth:8,borderRadius:"6px 6px 2px 2px",background:i>8?"#6d5dfc":"#315f8c",opacity:.85}} title={`${v} complaints`}/>)}</Box></Box></Grid>
      <Grid size={12}><Box className="neo" sx={{p:3,borderRadius:2}}><Box sx={{display:"flex",alignItems:"center",gap:1,mb:2}}><LocationOnRounded color="primary"/><Box><Typography variant="h6" fontWeight={900}>{t("highLocations")}</Typography><Typography color="text.secondary">Areas with the highest concentration of high-priority complaints.</Typography></Box></Box><Grid container spacing={1.2}>{hotspots.map(([name,count,cat],i)=><Grid key={name} size={{xs:12,sm:6,lg:3}}><Box className="neo-soft" sx={{p:1.8,borderRadius:1.7,height:"100%"}}><Typography variant="caption" color="text.secondary">#{i+1} hotspot</Typography><Typography fontWeight={850} sx={{mt:.4}}>{name}</Typography><Typography variant="body2" color="text.secondary">{cat}</Typography><Typography sx={{mt:1.2,fontSize:25,fontWeight:900}}>{count}</Typography><Typography variant="caption" color="text.secondary">high-priority reports</Typography></Box></Grid>)}</Grid></Box></Grid>
    </Grid>
  </Box>;
}
