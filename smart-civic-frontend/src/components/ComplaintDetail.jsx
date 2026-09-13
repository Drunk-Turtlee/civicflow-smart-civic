// -----------------------------------------------------------------------------
// ComplaintDetail.jsx — Complaint details + workflow timeline
// -----------------------------------------------------------------------------
// This screen displays the complete lifecycle required by the case study:
//
// New -> Assigned -> In Progress -> Resolved
//
// In admin mode it also exposes status and comment controls.
//
// CURRENT STATE:
// Status changes are local UI state only. They are NOT persisted to FastAPI yet.
//
// FUTURE BACKEND:
// The status selector should call the backend PATCH endpoint, then update the UI
// after the server confirms success.
// -----------------------------------------------------------------------------

import { useState } from "react";
import { Box, Button, Chip, Divider, MenuItem, Select, TextField, Typography } from "@mui/material";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import LocationOnRounded from "@mui/icons-material/LocationOnRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import { useTranslation } from "react-i18next";
import StatusChip from "./StatusChip";

export default function ComplaintDetail({ complaint, admin=false, onBack }) {
  const { t } = useTranslation();
  const [status,setStatus] = useState(complaint.status);
  const [comment,setComment] = useState("");
  const steps = ["New","Assigned","In Progress","Resolved"];
  const active = steps.indexOf(status);

  return (
    <Box>
      <Button startIcon={<ArrowBackRounded />} onClick={onBack} sx={{mb:2}}>Back</Button>
      <Box className="neo" sx={{p:{xs:2,md:3},borderRadius:2}}>
        <Box sx={{display:"flex",justifyContent:"space-between",gap:2,flexWrap:"wrap"}}>
          <Box>
            <Typography variant="h4" fontWeight={900}>{complaint.title}</Typography>
            <Typography color="text.secondary" sx={{mt:.7}}>{complaint.id} · {complaint.time}</Typography>
          </Box>
          <StatusChip status={status} />
        </Box>

        <Box sx={{display:"grid",gridTemplateColumns:{xs:"1fr",md:"repeat(3,1fr)"},gap:1.5,my:3}}>
          {[
            [<LocationOnRounded/>,"Location",complaint.location],
            [<AccessTimeRounded/>,"SLA due",complaint.age+" days aging"],
            [<PersonRounded/>,"Assigned to",complaint.assigned]
          ].map(([icon,label,value])=><Box key={label} className="neo-soft" sx={{p:2,borderRadius:2}}>
            <Box sx={{display:"flex",gap:1,alignItems:"center",color:"#315f8c"}}>{icon}<Typography variant="caption" fontWeight={800}>{label}</Typography></Box>
            <Typography fontWeight={800} sx={{mt:.8}}>{value}</Typography>
          </Box>)}
        </Box>

        <Box sx={{px:{xs:0,md:2},py:2}}>
          <Typography fontWeight={850} sx={{mb:2}}>Status timeline</Typography>
          <Box sx={{display:"flex",alignItems:"flex-start",overflowX:"auto",pb:1}}>
            {steps.map((s,i)=><Box key={s} sx={{minWidth:150,flex:1,textAlign:"center",position:"relative"}}>
              {i < steps.length-1 && <Box sx={{position:"absolute",top:14,left:"50%",right:"-50%",height:3,bgcolor:i<active?"#315f8c":"#d7dee7",zIndex:0}} />}
              <Box sx={{position:"relative",zIndex:1,mx:"auto",width:30,height:30,borderRadius:"50%",display:"grid",placeItems:"center",
                bgcolor:i<=active?"#315f8c":"#dfe5ec",color:i<=active?"#fff":"#8390a1",
                boxShadow:i<=active?"4px 4px 8px rgba(163,177,198,.35), -4px -4px 8px #fff":"none"}}>
                {i<active ? <CheckCircleRounded fontSize="small"/> : i+1}
              </Box>
              <Typography variant="caption" fontWeight={800} sx={{display:"block",mt:1}}>{s}</Typography>
            </Box>)}
          </Box>
        </Box>

        <Divider sx={{my:2}} />
        <Typography fontWeight={850} sx={{mb:1}}>Description</Typography>
        <Typography color="text.secondary" sx={{lineHeight:1.8,maxWidth:900}}>{complaint.description}</Typography>

        {admin && (
          <Box sx={{mt:3,display:"grid",gridTemplateColumns:{xs:"1fr",md:"1fr 1fr"},gap:2}}>
            <Box className="neo-inset" sx={{p:2,borderRadius:2}}>
              <Typography fontWeight={800} sx={{mb:1}}>Update status</Typography>
              <Select fullWidth size="small" value={status} onChange={e=>setStatus(e.target.value)} sx={{borderRadius:2}}>
                {steps.map(s=><MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </Box>
            <Box className="neo-inset" sx={{p:2,borderRadius:2}}>
              <Typography fontWeight={800} sx={{mb:1}}>{t("addComment")}</Typography>
              <TextField fullWidth size="small" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Write an internal update..." />
              <Button sx={{mt:1}} variant="contained" disabled={!comment.trim()}>Add update</Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}