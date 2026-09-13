import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, FormControlLabel, Checkbox, Switch, Typography, CircularProgress,
  InputAdornment, IconButton
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleConfirmClick() {
    if (changePassword) {
      if (newPassword.length < 8) {
        setError("Yeni parola en az 8 karakter olmalıdır.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Parolalar eşleşmiyor.");
        return;
      }
    }
    setError("");
    setConfirmEdit(true);
  }

  async function handleUpdate() {
    setLoading(true);
    try {
      await axiosInstance.put(`/users/${targetUser.id}`, {
        email,
        roleId: Number(roleId),
        isActive,
        resetPassword: changePassword,
        newPassword: changePassword ? newPassword : null,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError("Kullanıcı güncellenemedi.");
      setLoading(false);
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
                  checked={changePassword}
                  onChange={(e) => {
                    setChangePassword(e.target.checked);
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                />
              }
              label="Kullanıcının Parolasını Değiştir"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  color="success"
                />
              }
              label={isActive ? "Hesap Aktif" : "Hesap Pasif"}
            />
            {changePassword && (
              <>
                <TextField
                  label="Yeni Parola (min. 8 karakter)"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Yeni Parola Tekrar"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                />
              </>
            )}
            {error && <Box sx={{ color: "error.main" }}>{error}</Box>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            İptal
          </Button>
          <Button
            onClick={handleConfirmClick}
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
          message={`"${targetUser.fullName}" adlı kullanıcı için değişiklikleri onaylıyor musunuz?`}
          onConfirm={() => { setConfirmEdit(false); handleUpdate(); }}
          onCancel={() => setConfirmEdit(false)}
        />
      )}
    </>
  );
}

export default EditUserModal;