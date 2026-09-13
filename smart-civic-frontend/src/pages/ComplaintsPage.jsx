// -----------------------------------------------------------------------------
// ComplaintsPage.jsx — Complaint queue/list
// -----------------------------------------------------------------------------
// The same page is reused for:
//   Citizen -> "My Complaints"
//   Admin   -> "Operations Queue"
//
// `admin` is a simple presentation prop. The backend authorization system should
// ultimately decide whether a user is allowed to access admin data.
// -----------------------------------------------------------------------------

import { useState } from "react";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import { complaints } from "../data/mockData";
import ComplaintTable from "../components/ComplaintTable";
import ComplaintDetail from "../components/ComplaintDetail";
import { useTranslation } from "react-i18next";

export default function ComplaintsPage({admin=false}) {
  const {t}=useTranslation(); const [q,setQ]=useState(""); const [selected,setSelected]=useState(null);
  const rows=complaints.filter(x=>[x.id,x.title,x.category,x.location,x.status].join(" ").toLowerCase().includes(q.toLowerCase()));
  if(selected) return <ComplaintDetail complaint={selected} admin={admin} onBack={()=>setSelected(null)} />;
  return <Box>
    <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"end",mb:2.5,gap:2,flexWrap:"wrap"}}>
      <Box><Typography variant="h3">{admin?t("queue"):t("myComplaints")}</Typography><Typography color="text.secondary">{admin?t("queueHint"):"Track every issue you have reported."}</Typography></Box>
      <TextField value={q} onChange={e=>setQ(e.target.value)} placeholder={t("search")} size="small"
        InputProps={{startAdornment:<InputAdornment position="start"><SearchRounded/></InputAdornment>}}
        sx={{width:{xs:"100%",sm:330},"& .MuiOutlinedInput-root":{borderRadius:2}}}/>
    </Box>
    <ComplaintTable rows={rows} onSelect={setSelected}/>
  </Box>;
}