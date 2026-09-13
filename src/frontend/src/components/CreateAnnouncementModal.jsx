import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, CircularProgress
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import ConfirmDialog from "./ConfirmDialog";
import { useState } from "react";

function CreateAnnouncementModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [validationError, setValidationError] = useState("");

  async function handleCreate() {
    setLoading(true);
    try {
      await axiosInstance.post("/announcements", {
        title,
        content,
        isActive: true,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError("Duyuru oluşturulamadı.");
      setLoading(false);
    }
  }

  return (
    <>
      <Dialog open onClose={() => setConfirmCancel(true)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Duyuru Yayınla</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Duyuru Başlığı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Duyuru İçeriği"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              multiline
              rows={3}
              inputProps={{ maxLength: 100 }}
            />
            {validationError && <Box sx={{ color: "error.main" }}>{validationError}</Box>}
            {error && <Box sx={{ color: "error.main" }}>{error}</Box>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancel(true)} color="inherit" disabled={loading}>
            İptal
          </Button>
          <Button
            onClick={() => {
              if (!title.trim()) {
                setValidationError("Duyuru başlığı zorunludur.");
                return;
              }
              if (!content.trim()) {
                setValidationError("Duyuru içeriği zorunludur.");
                return;
              }
              setValidationError("");
              setConfirmCreate(true);
            }}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {loading ? "Yayınlanıyor..." : "Oluştur"}
          </Button>
        </DialogActions>
      </Dialog>

      {confirmCreate && (
        <ConfirmDialog
          message="Duyuruyu yayınlamak istediğinize emin misiniz?"
          onConfirm={() => { setConfirmCreate(false); handleCreate(); }}
          onCancel={() => setConfirmCreate(false)}
        />
      )}

      {confirmCancel && (
        <ConfirmDialog
          message="İptal etmek istediğinize emin misiniz?"
          onConfirm={() => { setConfirmCancel(false); onClose(); }}
          onCancel={() => setConfirmCancel(false)}
        />
      )}
    </>
  );
}

export default CreateAnnouncementModal;