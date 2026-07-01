import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, FormControlLabel, Checkbox
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import ConfirmDialog from "./ConfirmDialog";

function CreateAnnouncementModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sendEmailNotification, setSendEmailNotification] = useState(false);
  const [error, setError] = useState("");
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  async function handleCreate() {
    try {
      await axiosInstance.post("/announcements", {
        title,
        content,
        isActive: true,
        sendEmailNotification,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError("Duyuru oluşturulamadı.");
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={sendEmailNotification}
                  onChange={(e) => setSendEmailNotification(e.target.checked)}
                />
              }
              label="Yayınlandığında tüm personellere otomatik e-posta bildirimi at"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancel(true)} color="inherit">İptal</Button>
          <Button onClick={() => setConfirmCreate(true)} variant="contained">Oluştur</Button>
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