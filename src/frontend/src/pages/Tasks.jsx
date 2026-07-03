import { useState, useEffect } from "react";
import {
  Box, Typography, Button, Table, TableHead, TableBody,
  TableRow, TableCell, Paper, Select, MenuItem, IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import ConfirmDialog from "../components/ConfirmDialog";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const isPersonel = user.role === "Personel";

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const endpoint = isPersonel ? "/tasks/my" : "/tasks";
      const response = await axiosInstance.get(endpoint);
      setTasks(response.data.data);
    } catch (err) {
      setError("Görevler yüklenemedi.");
    }
  }

  async function handleStatusChange(taskId, newStatus) {
    try {
      await axiosInstance.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
      showSnackbar("Görev durumu güncellendi.");
    } catch (err) {
      showSnackbar("Durum güncellenemedi.", "error");
    }
  }

  if (error) return <Typography color="error" sx={{ p: 3 }}>{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Görev Yönetimi</Typography>
        {!isPersonel && (
          <Button variant="contained" onClick={() => setShowModal(true)}>
            + Yeni Görev Oluştur
          </Button>
        )}
      </Box>

      <Paper sx={{ width: "100%", overflowX: "auto" }}>
        {tasks.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
                Henüz hiç görev oluşturulmamış.
              </Box>
            ) : (
        <Table sx={{ "& td, & th": { verticalAlign: "middle" } }}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Görev Başlığı</strong></TableCell>
              <TableCell><strong>Atanan Kişi</strong></TableCell>
              <TableCell><strong>Öncelik</strong></TableCell>
              <TableCell><strong>Bitiş Tarihi</strong></TableCell>
              <TableCell><strong>Durum</strong></TableCell>
              {!isPersonel && <TableCell sx={{ width: 100 }}><strong>İşlemler</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.assignedUserName}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{new Date(task.dueDate).toLocaleDateString("tr-TR")}</TableCell>
                <TableCell>
                  <Select
                    value={task.status}
                    size="small"
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <MenuItem value="Bekliyor">Bekliyor</MenuItem>
                    <MenuItem value="Başladı">Başladı</MenuItem>
                    <MenuItem value="Tamamlandı">Tamamlandı</MenuItem>
                  </Select>
                </TableCell>
                {!isPersonel && (
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => setEditingTask(task)}
                        sx={{
                          bgcolor: "#2563EB",
                          color: "white",
                          borderRadius: 2,
                          width: 32,
                          height: 32,
                          "&:hover": { bgcolor: "#1d4ed8" },
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setDeletingTask(task)}
                        sx={{
                          bgcolor: "#fee2e2",
                          color: "#dc2626",
                          borderRadius: 2,
                          width: 32,
                          height: 32,
                          "&:hover": { bgcolor: "#fecaca" },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </Paper>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            fetchTasks();
            showSnackbar("Görev başarıyla oluşturuldu.");
          }}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdated={() => {
            fetchTasks();
            showSnackbar("Görev başarıyla güncellendi.");
          }}
        />
      )}

      {deletingTask && (
        <ConfirmDialog
          message={`"${deletingTask.title}" adlı görevi "${deletingTask.assignedUserName}" kişisinden silmek istediğinize emin misiniz?`}
          onConfirm={async () => {
            try {
              await axiosInstance.delete(`/tasks/${deletingTask.id}`);
              fetchTasks();
              showSnackbar("Görev başarıyla silindi.");
            } catch (err) {
              showSnackbar("Görev silinemedi.", "error");
            }
            setDeletingTask(null);
          }}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </Box>
  );
}

export default Tasks;