import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import ConfirmDialog from "./ConfirmDialog";

function CreateTaskModal({ onClose, onCreated }) {
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [priority, setPriority] = useState("Orta");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axiosInstance.get("/users");
        setUsers(response.data.data);
      } catch (err) {
        setError("Kullanıcı listesi yüklenemedi.");
      }
    }
    fetchUsers();
  }, []);

  async function handleCreate() {
    try {
      await axiosInstance.post("/tasks", {
        title,
        description,
        assignedUserId: Number(assignedUserId),
        priority,
        dueDate,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError("Görev oluşturulamadı.");
    }
  }

  return (
    <>
      <Dialog open onClose={() => setConfirmCancel(true)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Görev Oluştur</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Görev Başlığı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Atanan Kişi"
              select
              value={assignedUserId}
              onChange={(e) => setAssignedUserId(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Seçiniz</MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>{u.fullName}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Öncelik"
              select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              fullWidth
            >
              <MenuItem value="Düşük">Düşük</MenuItem>
              <MenuItem value="Orta">Orta</MenuItem>
              <MenuItem value="Yüksek">Yüksek</MenuItem>
            </TextField>
            <TextField
              label="Bitiş Tarihi"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Açıklama"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              inputProps={{ maxLength: 100 }}
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
          message="Görevi oluşturmak istediğinize emin misiniz?"
          onConfirm={() => { setConfirmCreate(false); handleCreate(); }}
          onCancel={() => setConfirmCreate(false)}
        />
      )}

      {confirmCancel && (
        <ConfirmDialog
          message="Yeni görev oluşturmayı iptal etmek istediğinize emin misiniz?"
          onConfirm={() => { setConfirmCancel(false); onClose(); }}
          onCancel={() => setConfirmCancel(false)}
        />
      )}
    </>
  );
}

export default CreateTaskModal;