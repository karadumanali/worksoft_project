import { useState, useEffect } from "react";
import {
  Box, Typography, Button, Table, TableHead, TableBody,
  TableRow, TableCell, Paper, Chip, IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";
import CreateAnnouncementModal from "../components/CreateAnnouncementModal";
import EditAnnouncementModal from "../components/EditAnnouncementModal";
import ConfirmDialog from "../components/ConfirmDialog";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState(null);
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const isAdmin = user.role === "Admin";

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    try {
      const response = await axiosInstance.get("/announcements");
      setAnnouncements(response.data.data);
    } catch (err) {
      setError("Duyurular yüklenemedi.");
    }
  }

  if (error) return <Typography color="error" sx={{ p: 3 }}>{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Duyuru Yönetimi</Typography>
        {isAdmin && (
          <Button variant="contained" onClick={() => setShowModal(true)}>
            + Yeni Duyuru Yayınla
          </Button>
        )}
      </Box>

      <Paper>
        {announcements.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
            Henüz hiç duyuru yayınlanmamış.
          </Box>
        ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Duyuru Başlığı</strong></TableCell>
              <TableCell><strong>İçerik Özeti</strong></TableCell>
              <TableCell><strong>Yayın Tarihi</strong></TableCell>
              <TableCell><strong>Durum</strong></TableCell>
              {isAdmin && <TableCell><strong>İşlemler</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {announcements.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.title}</TableCell>
                <TableCell>
                  {a.content.length > 50 ? a.content.slice(0, 50) + "..." : a.content}
                </TableCell>
                <TableCell>{new Date(a.publishDate).toLocaleDateString("tr-TR")}</TableCell>
                <TableCell>
                  <Chip
                    label={a.isActive ? "Açık" : "Kapalı"}
                    color={a.isActive ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <IconButton color="primary" onClick={() => setEditingAnnouncement(a)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => setDeletingAnnouncement(a)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </Paper>

      {showModal && (
        <CreateAnnouncementModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            fetchAnnouncements();
            showSnackbar("Duyuru başarıyla yayınlandı.");
          }}
        />
      )}

      {editingAnnouncement && (
        <EditAnnouncementModal
          announcement={editingAnnouncement}
          onClose={() => setEditingAnnouncement(null)}
          onUpdated={() => {
            fetchAnnouncements();
            showSnackbar("Duyuru başarıyla güncellendi.");
          }}
        />
      )}

      {deletingAnnouncement && (
        <ConfirmDialog
          message={`"${deletingAnnouncement.title}" başlıklı duyuruyu silmek istediğinize emin misiniz?`}
          onConfirm={async () => {
            try {
              await axiosInstance.delete(`/announcements/${deletingAnnouncement.id}`);
              fetchAnnouncements();
              showSnackbar("Duyuru başarıyla silindi.");
            } catch (err) {
              showSnackbar("Duyuru silinemedi.", "error");
            }
            setDeletingAnnouncement(null);
          }}
          onCancel={() => setDeletingAnnouncement(null)}
        />
      )}
    </Box>
  );
}

export default Announcements;