import { useRef, useState, useEffect } from "react";
import {
  Box, Typography, List, ListItem, ListItemButton, ListItemText,
  Button, Divider, IconButton, Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoCropModal from "./LogoCropModal";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [logo, setLogo] = useState(null);
  const [cropSrc, setCropSrc] = useState(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem("worksoft_logo");
    if (savedLogo) setLogo(savedLogo);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCropSrc(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleSaveLogo(croppedBase64) {
    localStorage.setItem("worksoft_logo", croppedBase64);
    setLogo(croppedBase64);
  }

  const canSeeDashboard = user.role === "Admin" || user.role === "Yönetici";
  const canSeeUsers = user.role === "Admin";
  const isAdmin = user.role === "Admin";

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
        {/* Logo alanı */}
        <Box sx={{ px: 2, mb: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {logo ? (
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{ width: 80, height: 80, objectFit: "contain" }}
              />
              {isAdmin && (
                <Tooltip title="Logoyu değiştir">
                  <IconButton
                    size="small"
                    onClick={() => fileInputRef.current.click()}
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                      width: 24,
                      height: 24,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <EditIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "white" }}>
                WORKSOFT
              </Typography>
              {isAdmin && (
                <Tooltip title="Logo ekle">
                  <IconButton
                    size="small"
                    onClick={() => fileInputRef.current.click()}
                    sx={{ color: "text.secondary" }}
                  >
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Box>

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

      {cropSrc && (
        <LogoCropModal
          imageSrc={cropSrc}
          onClose={() => setCropSrc(null)}
          onSave={handleSaveLogo}
        />
      )}
    </Box>
  );
}

export default Sidebar;