// -----------------------------------------------------------------------------
// AdminDashboard.jsx — Municipal operations command center
// -----------------------------------------------------------------------------
import { useMemo } from "react";
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
import { getAllComplaints, getCurrentUser, getTimeGreeting } from "../data/complaintsStore";
import { distribution } from "../data/mockData";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const currentUser = useMemo(() => getCurrentUser(), []);
  const allComplaints = useMemo(() => getAllComplaints(), []);

  const urgent = allComplaints.filter((x) => ["Critical", "High"].includes(x.priority));
  const unresolved = allComplaints.filter((x) => x.status !== "Resolved");
  const hotspots = ["Sector 18, Noida", "MG Road Junction", "Sector 62 Market", "Block B, Sector 50"];

  return (
    <Box>
      {/* Header with Dynamic Time Greeting & Officer / Admin Name */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h3" fontWeight={900}>
            {getTimeGreeting(currentUser.name)} 👋
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.7 }}>
            {t("queueHint")} • Municipal Operations Console
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate("/admin/complaints")} startIcon={<AssignmentRounded />}>
          Open complaint queue
        </Button>
      </Box>

      {/* Stats Summary */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard icon={<AssignmentRounded />} label="Total Complaints" value={allComplaints.length} hint="Active queue" tone="blue" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard icon={<WarningAmberRounded />} label="High priority" value={urgent.length} hint="Requires immediate dispatch" tone="amber" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard icon={<AccessTimeRounded />} label="Unresolved" value={unresolved.length} hint="In progress" tone="purple" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard icon={<CheckCircleRounded />} label="SLA met" value="92.4%" hint="+2.1% this week" tone="green" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box className="neo" sx={{ p: 2.5, borderRadius: 2, mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2, gap: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={900}>
                  Priority queue
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ranked by severity score, category, and SLA urgency.
                </Typography>
              </Box>
              <Chip icon={<TrendingUpRounded />} label="AI Ranked" color="primary" variant="outlined" />
            </Box>
            <ComplaintTable rows={urgent.slice(0, 5)} onSelect={(row) => navigate(`/admin/complaints?focus=${row.id}`)} />
          </Box>

          <Box className="neo" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={900} sx={{ mb: 0.5 }}>
              Workload snapshot
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Current unresolved complaints by category.
            </Typography>
            {distribution.map(([name, val]) => (
              <Box key={name} sx={{ mb: 1.8 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography fontWeight={750}>{name}</Typography>
                  <Typography fontWeight={850}>{Math.round(val * 12.5)}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={val * 2.5} sx={{ height: 7, borderRadius: 2 }} />
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Box className="neo" sx={{ p: 2.5, borderRadius: 2, mb: 2 }}>
            <Typography variant="h6" fontWeight={900}>
              SLA performance
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
              Current month by service.
            </Typography>
            {[
              ["Road Damage", 88],
              ["Garbage", 91],
              ["Pothole", 86],
              ["Other", 72],
            ].map(([name, val]) => (
              <Box key={name} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography fontWeight={750}>{name}</Typography>
                  <Typography fontWeight={850}>{val}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={val} sx={{ height: 7, borderRadius: 2 }} />
              </Box>
            ))}
            <Button fullWidth variant="outlined" onClick={() => navigate("/admin/analytics")}>
              View full analytics
            </Button>
          </Box>

          <Box className="neo" sx={{ p: 2.5, borderRadius: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <LocationOnRounded color="primary" />
              <Typography variant="h6" fontWeight={900}>
                Hotspot locations
              </Typography>
            </Box>
            {hotspots.map((name, i) => (
              <Box
                key={name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.1,
                  borderBottom: i < 3 ? "1px solid" : "none",
                  borderColor: "divider",
                }}
              >
                <Typography fontWeight={750}>
                  {i + 1}. {name}
                </Typography>
                <Chip size="small" label={[42, 37, 29, 24][i]} />
              </Box>
            ))}
          </Box>

          <Box className="neo-soft" sx={{ p: 2, borderRadius: 2 }}>
            <Typography fontWeight={850}>Aging alert</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
              {unresolved.filter((x) => x.age > 7).length || 1} sampled complaints are over 7 days old. Escalation is handled by the automated SLA rules.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
