import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ConfirmDialog from "./ConfirmDialog";

function CreateAnnouncementModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sendEmailNotification, setSendEmailNotification] = useState(false);
  const [error, setError] = useState("");
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  async function handleCreate() {
    try {
      await axiosInstance.post("/announcements", {
        title,
        content,
        isActive: true,
        sendEmailNotification,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError("Duyuru oluşturulamadı.");
    }
  }

  function handleCreateClick() {
    setConfirmCreate(true);
  }

  function handleCancelClick() {
    setConfirmCancel(true);
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
        <h3>Yeni Duyuru Yayınla</h3>

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
              checked={sendEmailNotification}
              onChange={(e) => setSendEmailNotification(e.target.checked)}
            />
            {" "}Yayınlandığında tüm personellere otomatik e-posta bildirimi at
          </label>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={handleCancelClick}>İptal</button>
          <button onClick={handleCreateClick}>Oluştur</button>
        </div>
      </div>

      {confirmCreate && (
        <ConfirmDialog
          message="Duyuruyu yayınlamak istediğinize emin misiniz?"
          onConfirm={() => {
            setConfirmCreate(false);
            handleCreate();
          }}
          onCancel={() => setConfirmCreate(false)}
        />
      )}

      {confirmCancel && (
        <ConfirmDialog
          message="İptal etmek istediğinize emin misiniz?"
          onConfirm={() => {
            setConfirmCancel(false);
            onClose();
          }}
          onCancel={() => setConfirmCancel(false)}
        />
      )}
    </div>
  );
}

export default CreateAnnouncementModal;