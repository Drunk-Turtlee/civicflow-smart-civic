// -----------------------------------------------------------------------------
// SettingsPage.jsx — User preferences
// -----------------------------------------------------------------------------
// Currently this contains language and notification preference controls.
//
// These switches are UI-only until the backend provides a preferences endpoint.
// -----------------------------------------------------------------------------

import { Box, Typography, FormControlLabel, Switch, Divider } from "@mui/material";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
  const {t}=useTranslation();
  return <Box sx={{maxWidth:850}}>
    <Box sx={{mb:3}}><Typography variant="h3">{t("settings")}</Typography><Typography color="text.secondary">Manage your portal preferences.</Typography></Box>
    <Box className="neo" sx={{p:3,borderRadius:2.5}}>
      <Typography variant="h6" fontWeight={900}>{t("language")}</Typography>
      <Typography color="text.secondary" sx={{mb:2}}>Choose an Indian language for the interface.</Typography>
      <LanguageSwitcher/>
      <Divider sx={{my:3}}/>
      <FormControlLabel control={<Switch defaultChecked/>} label="Complaint status notifications"/>
      <FormControlLabel control={<Switch defaultChecked/>} label="SLA reminders"/>
    </Box>
  </Box>;
}