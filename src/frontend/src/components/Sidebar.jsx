import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Button, Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const canSeeDashboard = user.role === "Admin" || user.role === "Yönetici";
  const canSeeUsers = user.role === "Admin";

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", show: canSeeDashboard },
    { label: "Görevler", path: "/tasks", show: true },
    { label: "Duyurular", path: "/announcements", show: true },
    { label: "Kullanıcılar", path: "/users", show: canSeeUsers },
  ];

  return (
    <Box
      sx={{
        width: 220,
        minHeight: "100vh",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        py: 2,
      }}
    >
      <Box>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ px: 2, mb: 2, color: "white" }}
        >
          WORKSOFT
        </Typography>
        <Divider />
        <List>
          {menuItems
            .filter((item) => item.show)
            .map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton component={Link} to={item.path}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Box>

      <Box sx={{ px: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" sx={{ mb: 1, color: "white" }}>
          {user.fullName}
        </Typography>
        <Button variant="outlined" size="small" fullWidth onClick={handleLogout}>
          Çıkış Yap
        </Button>
      </Box>
    </Box>
  );
}

export default Sidebar;