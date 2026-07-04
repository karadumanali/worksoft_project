import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, FormControlLabel, Switch, CircularProgress
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import ConfirmDialog from "./ConfirmDialog";

const roleOptions = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Yönetici" },
  { id: 3, name: "Personel" },
];

function CreateUserModal({ onClose, onCreated }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [roleId, setRoleId] = useState(3);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [validationError, setValidationError] = useState("");

  async function handleCreate() {
    setLoading(true);
    try {
      await axiosInstance.post("/users", {
        fullName,
        email,
        tempPassword,
        roleId: Number(roleId),
        isActive,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Kullanıcı oluşturulamadı.");
      setLoading(false);
    }
  }

  const selectedRoleName = roleOptions.find((r) => r.id === Number(roleId))?.name;

  return (
    <>
      <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Ad-Soyad"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
            />
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Geçici Parola"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
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
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              }
              label="Kullanıcı hemen aktif edilsin mi?"
            />
            {validationError && <Box sx={{ color: "error.main" }}>{validationError}</Box>}
            {error && <Box sx={{ color: "error.main" }}>{error}</Box>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            İptal
          </Button>
          <Button
            onClick={() => {
              if (!fullName.trim()) {
                setValidationError("Ad-Soyad zorunludur.");
                return;
              }
              if (!email.trim()) {
                setValidationError("E-mail zorunludur.");
                return;
              }
              if (!tempPassword.trim()) {
                setValidationError("Geçici parola zorunludur.");
                return;
              }
              setValidationError("");
              setConfirmCreate(true);
            }}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {loading ? "Oluşturuluyor..." : "Oluştur"}
          </Button>
        </DialogActions>
      </Dialog>

      {confirmCreate && (
        <ConfirmDialog
          message={`"${fullName}" adlı kullanıcıyı "${selectedRoleName}" rolünde eklemek istediğinize emin misiniz?`}
          onConfirm={() => { setConfirmCreate(false); handleCreate(); }}
          onCancel={() => setConfirmCreate(false)}
        />
      )}
    </>
  );
}

export default CreateUserModal;