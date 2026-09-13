import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, ToggleButton, ToggleButtonGroup, Slider, Typography
} from "@mui/material";

function getCroppedImg(imageSrc, pixelCrop, shape) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      let width = 200;
      let height = 200;

      if (shape === "rectV") {
        width = 300;
        height = 400;
      }

      if (shape === "rectH") {
        width = 400;
        height = 300;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (shape === "round") {
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
        ctx.clip();
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        width,
        height
      );

      resolve(canvas.toDataURL("image/png"));
    };
  });
}

function LogoCropModal({ imageSrc, onClose, onSave }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [shape, setShape] = useState("round");

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  async function handleSave() {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, shape);
    onSave(croppedImage);
    onClose();
  }

  const aspect =
    shape === "rectV"
      ? 3 / 4
      : shape === "rectH"
      ? 4 / 3
      : 1;

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Görseli Kırp</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>

          {/* Şekil seçimi */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">Şekil:</Typography>
            <ToggleButtonGroup
              value={shape}
              exclusive
              onChange={(_, val) => {
                if (val) setShape(val);
              }}
              size="small"
            >
              <ToggleButton value="round">Yuvarlak</ToggleButton>
              <ToggleButton value="square">Kare</ToggleButton>
              <ToggleButton value="rectV">Dikey</ToggleButton>
              <ToggleButton value="rectH">Yatay</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Kırpma alanı */}
          <Box sx={{ position: "relative", width: "100%", height: 300, bgcolor: "#111" }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={shape === "round" ? "round" : "rect"}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </Box>

          {/* Zoom slider */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">Yakınlaştır:</Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.05}
              onChange={(_, val) => setZoom(val)}
              sx={{ flex: 1 }}
            />
          </Box>

        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">İptal</Button>
        <Button onClick={handleSave} variant="contained">Kaydet</Button>
      </DialogActions>
    </Dialog>
  );
}

export default LogoCropModal;