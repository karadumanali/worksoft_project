import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, FormControlLabel, Checkbox, CircularProgress
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import ConfirmDialog from "./ConfirmDialog";

function EditAnnouncementModal({ announcement, onClose, onUpdated }) {
  const [title, setTitle] = useState(announcement.title);
  const [content, setContent] = useState(announcement.content);
  const [isActive, setIsActive] = useState(announcement.isActive);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmEdit, setConfirmEdit] = useState(false);

  async function handleUpdate() {
    setLoading(true);
    try {
      await axiosInstance.put(`/announcements/${announcement.id}`, {
        title,
        content,
        isActive,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError("Duyuru güncellenemedi.");
      setLoading(false);
    }
  }

  return (
    <>
      <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Duyuruyu Düzenle</DialogTitle>
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              }
              label="Aktif"
            />
            {error && <Box sx={{ color: "error.main" }}>{error}</Box>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            İptal
          </Button>
          <Button
            onClick={() => setConfirmEdit(true)}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {loading ? "Güncelleniyor..." : "Düzenle"}
          </Button>
        </DialogActions>
      </Dialog>

      {confirmEdit && (
        <ConfirmDialog
          message={`"${announcement.title}" başlıklı duyuruyu, "${title}" başlıklı duyuru ile değiştirmek istediğinize emin misiniz?`}
          onConfirm={() => { setConfirmEdit(false); handleUpdate(); }}
          onCancel={() => setConfirmEdit(false)}
        />
      )}
    </>
  );
}

export default EditAnnouncementModal;