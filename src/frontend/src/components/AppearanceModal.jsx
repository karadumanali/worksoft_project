import { useRef, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Divider
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoCropModal from "./LogoCropModal";

function AppearanceModal({ onClose }) {
  const logoInputRef = useRef(null);
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const img3Ref = useRef(null);
  const inputRefs = [img1Ref, img2Ref, img3Ref];

  const [logo, setLogo] = useState(localStorage.getItem("worksoft_logo") || null);
  const [loginImages, setLoginImages] = useState([
    localStorage.getItem("worksoft_login_image_1") || null,
    localStorage.getItem("worksoft_login_image_2") || null,
    localStorage.getItem("worksoft_login_image_3") || null,
  ]);
  const [cropSrc, setCropSrc] = useState(null);
  const [cropTarget, setCropTarget] = useState(null);

  function handleFileChange(e, target) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCropSrc(ev.target.result);
      setCropTarget(target);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleSaveCrop(croppedBase64) {
    if (cropTarget === "logo") {
      localStorage.setItem("worksoft_logo", croppedBase64);
      setLogo(croppedBase64);
      window.dispatchEvent(new Event("storage"));
    } else if (typeof cropTarget === "number") {
      const key = `worksoft_login_image_${cropTarget + 1}`;
      localStorage.setItem(key, croppedBase64);
      setLoginImages((prev) => {
        const updated = [...prev];
        updated[cropTarget] = croppedBase64;
        return updated;
      });
    }
    setCropSrc(null);
    setCropTarget(null);
  }

  function handleRemoveLogo() {
    localStorage.removeItem("worksoft_logo");
    setLogo(null);
    window.dispatchEvent(new Event("storage"));
  }

  function handleRemoveLoginImage(index) {
    const key = `worksoft_login_image_${index + 1}`;
    localStorage.removeItem(key);
    setLoginImages((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  }

  return (
    <>
      <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Görünüm Ayarları</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>

            {/* Logo */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Uygulama Logosu
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Sidebar'da ve log-in sayfasında görünür.
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {logo ? (
                  <Box
                    component="img"
                    src={logo}
                    alt="Logo"
                    sx={{ width: 80, height: 80, objectFit: "contain", borderRadius: 2, border: "1px solid", borderColor: "divider" }}
                  />
                ) : (
                  <Box sx={{ width: 80, height: 80, borderRadius: 2, border: "2px dashed", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="caption" color="text.secondary">Logo yok</Typography>
                  </Box>
                )}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={() => logoInputRef.current.click()}>
                    {logo ? "Değiştir" : "Yükle"}
                  </Button>
                  {logo && (
                    <Button variant="outlined" size="small" color="error" startIcon={<DeleteIcon />} onClick={handleRemoveLogo}>
                      Kaldır
                    </Button>
                  )}
                </Box>
              </Box>
              <input ref={logoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFileChange(e, "logo")} />
            </Box>

            <Divider />

            {/* Login Görselleri */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Login Sayfası Görselleri
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Login sayfasının sol tarafında seçilen görsel/ler gösterilir.
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[0, 1, 2].map((index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ width: 60 }}>
                      Görsel {index + 1}
                    </Typography>
                    {loginImages[index] ? (
                      <Box
                        component="img"
                        src={loginImages[index]}
                        sx={{ width: 45, height: 60, objectFit: "cover", borderRadius: 1, border: "1px solid", borderColor: "divider" }}
                      />
                    ) : (
                      <Box sx={{ width: 45, height: 60, borderRadius: 1, border: "2px dashed", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="caption" color="text.secondary">Yok</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={() => inputRefs[index].current.click()}>
                        {loginImages[index] ? "Değiştir" : "Yükle"}
                      </Button>
                      {loginImages[index] && (
                        <Button variant="outlined" size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleRemoveLoginImage(index)}>
                          Kaldır
                        </Button>
                      )}
                    </Box>
                    <input ref={inputRefs[index]} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFileChange(e, index)} />
                  </Box>
                ))}
              </Box>
            </Box>

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained">Kapat</Button>
        </DialogActions>
      </Dialog>

      {cropSrc && (
        <LogoCropModal
          imageSrc={cropSrc}
          onClose={() => { setCropSrc(null); setCropTarget(null); }}
          onSave={handleSaveCrop}
        />
      )}
    </>
  );
}

export default AppearanceModal;