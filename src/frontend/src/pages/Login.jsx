import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Alert, Paper } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [logo, setLogo] = useState(null);
  const [loginImages, setLoginImages] = useState([null, null, null]);

    useEffect(() => {
    const savedLogo = localStorage.getItem("worksoft_logo");
    if (savedLogo) setLogo(savedLogo);
    setLoginImages([
      localStorage.getItem("worksoft_login_image_1") || null,
      localStorage.getItem("worksoft_login_image_2") || null,
      localStorage.getItem("worksoft_login_image_3") || null,
    ]);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { token, userId, fullName, role } = response.data.data;
      login(token, { userId, fullName, role });
      if (role === "Personel") {
        navigate("/tasks");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Bir hata oluştu, tekrar deneyin."
      );
    }
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>

      {/* Sol taraf — logo + illüstrasyon */}
      <Box
        sx={{
          flex: 1,
          bgcolor: "#1e3a5f",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 6,
          gap: 4,
        }}
      >
        {/* Logo alanı */}
        <Box sx={{ textAlign: "center" }}>
          {logo ? (
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ width: 120, height: 120, objectFit: "contain" }}
            />
          ) : (
            <>
              <Typography variant="h3" fontWeight="bold" color="white" letterSpacing={2}>
                WORKSOFT
              </Typography>
              <Typography variant="h6" color="rgba(255,255,255,0.7)" mt={1}>
                Task Tracker
              </Typography>
            </>
          )}
        </Box>

        
        {/* İllüstrasyon */}
        <Box sx={{ width: "100%", maxWidth: 400, position: "relative", height: 320 }}>
          {loginImages.some(img => img) ? (
            <>
              {/* Arka sol görsel */}
              {loginImages[0] && (
                <Box
                  component="img"
                  src={loginImages[0]}
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%) rotate(-8deg)",
                    width: "55%",
                    height: 220,
                    objectFit: "cover",
                    borderRadius: 3,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    zIndex: 1,
                  }}
                />
              )}
              {/* Arka sağ görsel */}
              {loginImages[2] && (
                <Box
                  component="img"
                  src={loginImages[2]}
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%) rotate(8deg)",
                    width: "55%",
                    height: 220,
                    objectFit: "cover",
                    borderRadius: 3,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    zIndex: 1,
                  }}
                />
              )}
              {/* Ortadaki büyük görsel */}
              {loginImages[1] && (
                <Box
                  component="img"
                  src={loginImages[1]}
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "60%",
                    height: 260,
                    objectFit: "cover",
                    borderRadius: 3,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                    zIndex: 2,
                  }}
                />
              )}
            </>
          ) : (
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%" }}>
              <rect x="40" y="40" width="320" height="220" rx="16" fill="rgba(255,255,255,0.08)" />
              <rect x="70" y="70" width="120" height="12" rx="6" fill="rgba(255,255,255,0.4)" />
              <rect x="70" y="105" width="24" height="24" rx="6" fill="#4ade80" />
              <rect x="106" y="109" width="140" height="8" rx="4" fill="rgba(255,255,255,0.5)" />
              <rect x="106" y="122" width="80" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
              <rect x="70" y="145" width="24" height="24" rx="6" fill="#60a5fa" />
              <rect x="106" y="149" width="160" height="8" rx="4" fill="rgba(255,255,255,0.5)" />
              <rect x="106" y="162" width="100" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
              <rect x="70" y="185" width="24" height="24" rx="6" fill="#f59e0b" />
              <rect x="106" y="189" width="120" height="8" rx="4" fill="rgba(255,255,255,0.5)" />
              <rect x="106" y="202" width="60" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
              <rect x="280" y="60" width="60" height="28" rx="14" fill="#2563eb" />
              <text x="310" y="79" textAnchor="middle" fill="white" fontSize="11" fontFamily="sans-serif">Admin</text>
            </svg>
          )}
        </Box>

        <Typography 
          variant="h5" 
          textAlign="center" 
          fontWeight="medium"
          sx={{ color: "#ffffff", fontSize: "1.35rem" }}
        >
          Şirket içi yönetim ve iletişimi kolaylaştırın
        </Typography>
      </Box>

      {/* Sağ taraf — login formu */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: 4,
        }}
      >
        <Paper elevation={0} sx={{ width: "100%", maxWidth: 380, p: 4 }}>
          {/* Mobilde logo */}
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 1, display: { md: "none" } }}
          >
            WORKSOFT
          </Typography>

          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            Giriş Yap
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hesabınıza erişmek için giriş yapın.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="E-posta"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
            >
              Giriş Yap
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;