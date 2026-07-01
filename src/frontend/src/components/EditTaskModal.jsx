import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import ConfirmDialog from "./ConfirmDialog";

function EditTaskModal({ task, onClose, onUpdated }) {
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState(task.title);
  const [assignedUserId, setAssignedUserId] = useState(task.assignedUserId);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate.split("T")[0]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [confirmEdit, setConfirmEdit] = useState(false);

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

  async function handleUpdate() {
    try {
      await axiosInstance.put(`/tasks/${task.id}`, {
        title,
        description,
        assignedUserId: Number(assignedUserId),
        priority,
        dueDate,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError("Görev güncellenemedi.");
    }
  }

  return (
    <>
      <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Görev Düzenle</DialogTitle>
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
          <Button onClick={onClose} color="inherit">İptal</Button>
          <Button onClick={() => setConfirmEdit(true)} variant="contained">Düzenle</Button>
        </DialogActions>
      </Dialog>

      {confirmEdit && (
        <ConfirmDialog
          message="Düzenlemeyi onaylıyor musunuz?"
          onConfirm={() => { setConfirmEdit(false); handleUpdate(); }}
          onCancel={() => setConfirmEdit(false)}
        />
      )}
    </>
  );
}

export default EditTaskModal;