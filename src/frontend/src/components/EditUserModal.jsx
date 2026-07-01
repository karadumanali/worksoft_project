import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, FormControlLabel, Checkbox, Typography
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import ConfirmDialog from "./ConfirmDialog";

const roleOptions = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Yönetici" },
  { id: 3, name: "Personel" },
];

function EditUserModal({ targetUser, onClose, onUpdated }) {
  const currentRoleId = roleOptions.find((r) => r.name === targetUser.role)?.id || 3;

  const [email, setEmail] = useState(targetUser.email);
  const [roleId, setRoleId] = useState(currentRoleId);
  const [isActive, setIsActive] = useState(targetUser.isActive);
  const [resetPassword, setResetPassword] = useState(false);
  const [error, setError] = useState("");
  const [confirmEdit, setConfirmEdit] = useState(false);

  async function handleUpdate() {
    try {
      await axiosInstance.put(`/users/${targetUser.id}`, {
        email,
        roleId: Number(roleId),
        isActive,
        resetPassword,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError("Kullanıcı güncellenemedi.");
    }
  }

  return (
    <>
      <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Kullanıcıyı Düzenle
          <Typography variant="body2" color="text.secondary">
            ({targetUser.fullName})
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Yeni e-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Kullanıcı Rolü"
              select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              fullWidth
            >
              {roleOptions.map((r) => (
                <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={resetPassword}
                  onChange={(e) => setResetPassword(e.target.checked)}
                />
              }
              label="Kullanıcının Parolasını Sıfırla (Geçici parola e-posta ile iletilir)"
            />
          </Box>
          {error && <Box sx={{ color: "error.main", mt: 1 }}>{error}</Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">İptal</Button>
          <Button onClick={() => setConfirmEdit(true)} variant="contained">Düzenle</Button>
        </DialogActions>
      </Dialog>

      {confirmEdit && (
        <ConfirmDialog
          message={`"${targetUser.fullName}" adlı kullanıcı için değişiklikleri onaylıyor musunuz?`}
          onConfirm={() => { setConfirmEdit(false); handleUpdate(); }}
          onCancel={() => setConfirmEdit(false)}
        />
      )}
    </>
  );
}

export default EditUserModal;