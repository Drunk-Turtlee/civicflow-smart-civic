// -----------------------------------------------------------------------------
// AnalyticsPage.jsx — Municipal analytics
// -----------------------------------------------------------------------------
// This screen visualizes the operational information requested by the case study.
//
// Current values are demonstration data.
// In production, these should come from an analytics API endpoint.
//
// Keep chart/visual components presentation-only. Put calculations and business
// rules in the backend or a dedicated data transformation layer.
// -----------------------------------------------------------------------------

import { Box, Grid, Typography } from "@mui/material";
import { distribution } from "../data/mockData";
import { useTranslation } from "react-i18next";

export default function AnalyticsPage() {
  const {t}=useTranslation(); const max=Math.max(...distribution.map(x=>x[1]));
  return <Box>
    <Box sx={{mb:3}}><Typography variant="h3">{t("analytics")}</Typography><Typography color="text.secondary">Operational intelligence for municipal teams.</Typography></Box>
    <Grid container spacing={2}>
      <Grid size={{xs:12,md:7}}>
        <Box className="neo" sx={{p:3,borderRadius:2.5}}>
          <Typography variant="h6" fontWeight={900}>{t("issueDistribution")}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{mb:3}}>Share of complaints by category</Typography>
          {distribution.map(([name,val])=><Box key={name} sx={{mb:2.5}}>
            <Box sx={{display:"flex",justifyContent:"space-between",mb:.6}}><Typography fontWeight={750}>{name}</Typography><Typography fontWeight={850}>{val}%</Typography></Box>
            <Box sx={{height:12,borderRadius:10}} className="neo-inset"><Box sx={{height:"100%",width:`${(val/max)*100}%`,borderRadius:10,background:"linear-gradient(90deg,#315f8c,#6d5dfc)"}}/></Box>
          </Box>)}
        </Box>
      </Grid>
      <Grid size={{xs:12,md:5}}>
        <Box className="neo" sx={{p:3,borderRadius:2.5}}>
          <Typography variant="h6" fontWeight={900}>{t("aging")}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{mb:3}}>Unresolved complaint age</Typography>
          {[["0–2 days",38],["3–7 days",31],["8–14 days",21],[">14 days",10]].map(([x,v])=><Box key={x} sx={{display:"flex",justifyContent:"space-between",p:1.5,mb:1,borderRadius:2}} className="neo-soft"><Typography fontWeight={750}>{x}</Typography><Typography fontWeight={900}>{v}%</Typography></Box>)}
        </Box>
      </Grid>
      <Grid size={12}>
        <Box className="neo" sx={{p:3,borderRadius:2.5}}>
          <Typography variant="h6" fontWeight={900}>{t("highLocations")}</Typography>
          <Typography color="text.secondary" sx={{mb:2}}>Areas with the highest concentration of high-priority complaints</Typography>
          {["Sector 18, Noida","MG Road Junction","Sector 62 Market","Block B, Sector 50"].map((x,i)=><Box key={x} sx={{display:"flex",justifyContent:"space-between",alignItems:"center",p:1.5,mb:1,borderRadius:2}} className="neo-soft"><Typography fontWeight={800}>{i+1}. {x}</Typography><Typography fontWeight={900}>{[42,37,29,24][i]} complaints</Typography></Box>)}
        </Box>
      </Grid>
    </Grid>
  </Box>;
}