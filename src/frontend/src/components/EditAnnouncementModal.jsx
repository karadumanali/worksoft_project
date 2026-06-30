import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ConfirmDialog from "./ConfirmDialog";

function EditAnnouncementModal({ announcement, onClose, onUpdated }) {
  const [title, setTitle] = useState(announcement.title);
  const [content, setContent] = useState(announcement.content);
  const [isActive, setIsActive] = useState(announcement.isActive);
  const [error, setError] = useState("");
  const [confirmEdit, setConfirmEdit] = useState(false);

  async function handleUpdate() {
    try {
      await axiosInstance.put(`/announcements/${announcement.id}`, {
        title,
        content,
        isActive,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError("Duyuru güncellenemedi.");
    }
  }

  function handleUpdateClick() {
    setConfirmEdit(true);
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ background: "#1a1a1a", padding: "30px", borderRadius: "8px", width: "500px" }}>
        <h3>Duyuruyu Düzenle</h3>

        <div style={{ marginBottom: "10px" }}>
          <label>Duyuru Başlığı</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Duyuru İçeriği</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={100}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            {" "}Aktif
          </label>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose}>İptal</button>
          <button onClick={handleUpdateClick}>Düzenle</button>
        </div>
      </div>

      {confirmEdit && (
        <ConfirmDialog
          message={`"${announcement.title}" başlıklı duyuruyu, "${title}" başlıklı duyuru ile değiştirmek istediğinize emin misiniz?`}
          onConfirm={() => {
            setConfirmEdit(false);
            handleUpdate();
          }}
          onCancel={() => setConfirmEdit(false)}
        />
      )}
    </div>
  );
}

export default EditAnnouncementModal;