// -----------------------------------------------------------------------------
// AppShell.jsx — Shared application frame
// -----------------------------------------------------------------------------
// This component owns the navigation shell used by both experiences:
//
// Citizen:
//   /citizen
//
// Admin:
//   /admin
//
// It automatically detects which side of the application the user is viewing
// and changes the sidebar navigation accordingly.
//
// Backend integration should generally NOT be placed here. This component is
// presentation/navigation infrastructure, not business logic.
// -----------------------------------------------------------------------------

import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Box, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography, Divider } from "@mui/material";
import MenuRounded from "@mui/icons-material/MenuRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import ReportProblemRounded from "@mui/icons-material/ReportProblemRounded";
import AssignmentRounded from "@mui/icons-material/AssignmentRounded";
import AnalyticsRounded from "@mui/icons-material/AnalyticsRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import AddCircleOutlineRounded from "@mui/icons-material/AddCircleOutlineRounded";
import ShieldRounded from "@mui/icons-material/ShieldRounded";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function AppShell({ children }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = location.pathname.startsWith("/admin");
  const base = isAdmin ? "/admin" : "/citizen";

  const nav = isAdmin ? [
    ["/admin", "dashboard", <HomeRounded />],
    ["/admin/complaints", "complaints", <AssignmentRounded />],
    ["/admin/analytics", "analytics", <AnalyticsRounded />],
    ["/admin/settings", "settings", <SettingsRounded />]
  ] : [
    ["/citizen", "dashboard", <HomeRounded />],
    ["/citizen/report", "newComplaint", <AddCircleOutlineRounded />],
    ["/citizen/complaints", "myComplaints", <ReportProblemRounded />],
    ["/citizen/settings", "settings", <SettingsRounded />]
  ];

  const drawer = (
    <Box sx={{ height:"100%", p:2, display:"flex", flexDirection:"column" }}>
      <Box sx={{ px:1.2, py:1.5, display:"flex", alignItems:"center", gap:1.3 }}>
        <Box sx={{ width:40, height:40, borderRadius:3, display:"grid", placeItems:"center", color:"#fff",
          background:"linear-gradient(135deg,#315f8c,#5b83ac)", boxShadow:"5px 5px 12px rgba(163,177,198,.45), -5px -5px 12px #fff" }}>
          <ShieldRounded />
        </Box>
        <Box>
          <Typography fontWeight={900} fontSize={18}>{t("appName")}</Typography>
          <Typography variant="caption" color="text.secondary">{isAdmin ? t("operations") : t("citizenPortal")}</Typography>
        </Box>
      </Box>
      <Divider sx={{ my:1.5, borderColor:"rgba(35,48,68,.07)" }} />
      <List sx={{ flex:1 }}>
        {nav.map(([to,key,icon]) => (
          <ListItemButton key={to} component={NavLink} to={to} end={to===base}
            onClick={()=>setMobileOpen(false)}
            sx={{ mb:.7, borderRadius:2.2, color:"#617187",
              "&.active": { color:"#315f8c", bgcolor:"#e8eef5", boxShadow:"inset 4px 4px 8px rgba(163,177,198,.28), inset -4px -4px 8px #fff" },
              "&:hover": { bgcolor:"#e8eef5" } }}>
            <ListItemIcon sx={{ minWidth:40, color:"inherit" }}>{icon}</ListItemIcon>
            <ListItemText primary={t(key)} primaryTypographyProps={{fontWeight:750}} />
          </ListItemButton>
        ))}
      </List>
      {/* Language is intentionally controlled from the top-right header only.
          Keeping one selector prevents duplicate controls and saves sidebar space. */}
      <ListItemButton
        sx={{
          borderRadius: 2,
          minHeight: 44,
          px: 1.2,
          mb: .5,
          color: "#526176",
          "&:hover": { bgcolor: "#e3eaf2" }
        }}
        onClick={()=>navigate(base)}
      >
        <ListItemIcon sx={{minWidth:38, color:"inherit"}}><LogoutRounded /></ListItemIcon>
        <ListItemText primary={t("logout")} primaryTypographyProps={{fontWeight:700}} />
      </ListItemButton>
    </Box>
  );

  return (
    <Box sx={{ minHeight:"100vh", display:"flex" }}>
      <Drawer variant="permanent" sx={{ display:{xs:"none",md:"block"}, width:270, flexShrink:0,
        "& .MuiDrawer-paper": { width:270, boxSizing:"border-box", border:0, bgcolor:"#edf2f7", p:1.5 } }}>
        {drawer}
      </Drawer>
      <Drawer variant="temporary" open={mobileOpen} onClose={()=>setMobileOpen(false)}
        sx={{ "& .MuiDrawer-paper": { width:285, bgcolor:"#edf2f7", border:0 } }}>{drawer}</Drawer>
      <Box component="main" sx={{ flex:1, minWidth:0 }}>
        <Box sx={{ height:72, px:{xs:2,md:4}, display:"flex", alignItems:"center", justifyContent:"space-between",
          position:"sticky", top:0, zIndex:10, bgcolor:"rgba(237,242,247,.88)", backdropFilter:"blur(16px)" }}>
          <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
            <IconButton onClick={()=>setMobileOpen(true)} sx={{display:{md:"none"}, mr:.5}}><MenuRounded /></IconButton>
            <Typography sx={{display:{xs:"none",sm:"block"},fontWeight:700,color:"text.secondary"}}>{t("appTag")}</Typography>
          </Box>
          <LanguageSwitcher />
        </Box>
        <Box sx={{ px:{xs:2,md:4}, pb:5, maxWidth:1500, mx:"auto" }}>{children}</Box>
      </Box>
    </Box>
  );
}