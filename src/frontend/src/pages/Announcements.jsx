import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import CreateAnnouncementModal from "../components/CreateAnnouncementModal";
import EditAnnouncementModal from "../components/EditAnnouncementModal";
import ConfirmDialog from "../components/ConfirmDialog";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState(null);

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

  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Duyuru Yönetimi</h2>
        {isAdmin && (
        <button onClick={() => setShowModal(true)}>+ Yeni Duyuru Yayınla</button>
        )}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Duyuru Başlığı</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>İçerik Özeti</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Yayın Tarihi</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Durum</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((a) => (
            <tr key={a.id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{a.title}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {a.content.length > 50 ? a.content.slice(0, 50) + "..." : a.content}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {new Date(a.publishDate).toLocaleDateString("tr-TR")}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {a.isActive ? "Açık" : "Kapalı"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {isAdmin && (
                  <>
                    <button onClick={() => setEditingAnnouncement(a)}>Düzenle</button>
                    <button onClick={() => setDeletingAnnouncement(a)}>Sil</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <CreateAnnouncementModal
            onClose={() => setShowModal(false)}
            onCreated={fetchAnnouncements}
        />
        )}

        {editingAnnouncement && (
          <EditAnnouncementModal
            announcement={editingAnnouncement}
            onClose={() => setEditingAnnouncement(null)}
            onUpdated={fetchAnnouncements}
          />
        )}

        {deletingAnnouncement && (
          <ConfirmDialog
            message={`"${deletingAnnouncement.title}" başlıklı duyuruyu silmek istediğinize emin misiniz?`}
            onConfirm={async () => {
              try {
                await axiosInstance.delete(`/announcements/${deletingAnnouncement.id}`);
                fetchAnnouncements();
              } catch (err) {
                setError("Duyuru silinemedi.");
              }
              setDeletingAnnouncement(null);
            }}
            onCancel={() => setDeletingAnnouncement(null)}
          />
        )}
    </div>
  );
}

export default Announcements;