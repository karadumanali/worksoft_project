import { useState, useEffect } from "react";
import {
  Box, Typography, Button, Table, TableHead, TableBody,
  TableRow, TableCell, Paper, Chip, IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axiosInstance from "../api/axiosInstance";
import { useSnackbar } from "../context/SnackbarContext";
import CreateUserModal from "../components/CreateUserModal";
import EditUserModal from "../components/EditUserModal";

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data.data);
    } catch (err) {
      setError("Kullanıcılar yüklenemedi.");
    }
  }

  if (error) return <Typography color="error" sx={{ p: 3 }}>{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Kullanıcı Yönetimi</Typography>
        <Button variant="contained" onClick={() => setShowModal(true)}>
          + Yeni Kullanıcı Ekle
        </Button>
      </Box>

      <Paper>
        {users.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
            Henüz hiç kullanıcı eklenmemiş.
          </Box>
        ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Kullanıcı Bilgisi</strong></TableCell>
              <TableCell><strong>Rolü</strong></TableCell>
              <TableCell><strong>Kayıt Tarihi</strong></TableCell>
              <TableCell><strong>Hesap Durumu</strong></TableCell>
              <TableCell><strong>İşlemler</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <Typography fontWeight="bold">{u.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                </TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{new Date(u.createdDate).toLocaleDateString("tr-TR")}</TableCell>
                <TableCell>
                  <Chip
                    label={u.isActive ? "Aktif" : "Pasif"}
                    color={u.isActive ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => setEditingUser(u)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </Paper>

      {showModal && (
        <CreateUserModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            fetchUsers();
            showSnackbar("Kullanıcı başarıyla eklendi.");
          }}
        />
      )}

      {editingUser && (
        <EditUserModal
          targetUser={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdated={() => {
            fetchUsers();
            showSnackbar("Kullanıcı başarıyla güncellendi.");
          }}
        />
      )}
    </Box>
  );
}

export default Users;