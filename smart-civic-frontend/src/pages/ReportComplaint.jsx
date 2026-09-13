// -----------------------------------------------------------------------------
// ReportComplaint.jsx — Citizen complaint submission form
// -----------------------------------------------------------------------------
// This form represents the fields explicitly requested in the case study:
// category, description, location and priority.
//
// Photo upload, anonymous submission and Smart Assist are frontend controls
// prepared for future backend integration.
//
// CURRENTLY:
// Submitting the form only demonstrates the UI and navigates to the complaint
// list. It does NOT send data to FastAPI.
//
// FUTURE:
// Replace the submit handler with a call to the complaint service.
// -----------------------------------------------------------------------------

import { useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, Grid, MenuItem, Select, TextField, Typography, Alert } from "@mui/material";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import MyLocationRounded from "@mui/icons-material/MyLocationRounded";
import PhotoCameraRounded from "@mui/icons-material/PhotoCameraRounded";
import SendRounded from "@mui/icons-material/SendRounded";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ReportComplaint() {
  const {t}=useTranslation(); const navigate=useNavigate();
  const [form,setForm]=useState({category:"Streetlight",description:"",location:"",priority:"Medium",anonymous:false});
  const [submitted,setSubmitted]=useState(false);
  const set=(k,v)=>setForm({...form,[k]:v});
  const submit=(e)=>{e.preventDefault();setSubmitted(true);setTimeout(()=>navigate("/citizen/complaints"),700)};
  return (
    <Box sx={{maxWidth:1050,mx:"auto"}}>
      <Box sx={{mb:3}}><Typography variant="h3">{t("reportIssue")}</Typography><Typography color="text.secondary" sx={{mt:.7,maxWidth:720}}>{t("reportHint")}</Typography></Box>
      {submitted && <Alert severity="success" sx={{mb:2,borderRadius:2}}>Complaint submitted successfully. Your reference is CIV-2026-1049.</Alert>}
      <Box component="form" onSubmit={submit} className="neo" sx={{p:{xs:2,md:3.5},borderRadius:2.5}}>
        <Grid container spacing={2.5}>
          <Grid size={{xs:12,md:6}}>
            <Typography fontWeight={800} sx={{mb:.8}}>{t("category")}</Typography>
            <Select fullWidth value={form.category} onChange={e=>set("category",e.target.value)} sx={{borderRadius:2}}>
              {["Streetlight","Pothole / Road","Garbage / Waste","Water Supply","Drainage","Other"].map(x=><MenuItem key={x} value={x}>{x}</MenuItem>)}
            </Select>
          </Grid>
          <Grid size={{xs:12,md:6}}>
            <Typography fontWeight={800} sx={{mb:.8}}>{t("priority")}</Typography>
            <Select fullWidth value={form.priority} onChange={e=>set("priority",e.target.value)} sx={{borderRadius:2}}>
              {["Low","Medium","High"].map(x=><MenuItem key={x} value={x}>{x}</MenuItem>)}
            </Select>
          </Grid>
          <Grid size={12}>
            <Typography fontWeight={800} sx={{mb:.8}}>{t("description")}</Typography>
            <TextField required fullWidth multiline minRows={6} value={form.description} onChange={e=>set("description",e.target.value)}
              placeholder="Example: There has been no street light near Gate 3 for almost a week..." sx={{"& .MuiOutlinedInput-root":{borderRadius:2}}}/>
            <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",mt:1}}>
              <Button type="button" startIcon={<AutoAwesomeRounded/>} sx={{color:"#6557ca"}}>Smart assist</Button>
              <Typography variant="caption" color="text.secondary">0 / 1000</Typography>
            </Box>
          </Grid>
          <Grid size={12}>
            <Typography fontWeight={800} sx={{mb:.8}}>{t("location")}</Typography>
            <Box sx={{display:"flex",gap:1}}>
              <TextField required fullWidth value={form.location} onChange={e=>set("location",e.target.value)} placeholder="Sector, street, landmark..." sx={{"& .MuiOutlinedInput-root":{borderRadius:2}}}/>
              <Button type="button" className="neo-soft" sx={{minWidth:52,borderRadius:2,color:"#315f8c"}}><MyLocationRounded/></Button>
            </Box>
          </Grid>
          <Grid size={{xs:12,md:6}}>
            <Button fullWidth variant="outlined" startIcon={<PhotoCameraRounded/>} sx={{height:54,borderRadius:2,borderStyle:"dashed"}}>{t("attachPhoto")} <Typography component="span" sx={{ml:.5,fontSize:12}}>({t("optional")})</Typography></Button>
          </Grid>
          <Grid size={{xs:12,md:6}}>
            <FormControlLabel control={<Checkbox checked={form.anonymous} onChange={e=>set("anonymous",e.target.checked)}/>} label={t("anonymous")} />
          </Grid>
          <Grid size={12}>
            <Box sx={{display:"flex",justifyContent:"flex-end",gap:1.5,mt:1}}>
              <Button type="button" onClick={()=>navigate("/citizen")} sx={{borderRadius:2}}>{t("cancel")}</Button>
              <Button type="submit" variant="contained" size="large" endIcon={<SendRounded/>} sx={{borderRadius:2.2,px:3}}>{t("submit")}</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}