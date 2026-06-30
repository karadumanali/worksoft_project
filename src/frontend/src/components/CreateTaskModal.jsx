import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import ConfirmDialog from "./ConfirmDialog";

function CreateTaskModal({ onClose, onCreated }) {
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [priority, setPriority] = useState("Orta");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

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

  async function handleCreate() {
    try {
      await axiosInstance.post("/tasks", {
        title,
        description,
        assignedUserId: Number(assignedUserId),
        priority,
        dueDate,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError("Görev oluşturulamadı.");
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
        <h3>Yeni Görev Oluştur</h3>

        <div style={{ marginBottom: "10px" }}>
          <label>Görev Başlığı</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Atanan Kişi</label>
          <select
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="">Seçiniz</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Öncelik</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="Düşük">Düşük</option>
            <option value="Orta">Orta</option>
            <option value="Yüksek">Yüksek</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Bitiş Tarihi</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Açıklama</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={100}
            style={{ width: "100%" }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button onClick={handleCancelClick}>İptal</button>
            <button onClick={handleCreateClick}>Oluştur</button>
        </div>
      </div>
      {confirmCreate && (
        <ConfirmDialog
            message="Görevi oluşturmak istediğinize emin misiniz?"
            onConfirm={() => {
            setConfirmCreate(false);
            handleCreate();
            }}
            onCancel={() => setConfirmCreate(false)}
        />
        )}

        {confirmCancel && (
        <ConfirmDialog
            message="Yeni görev oluşturmayı iptal etmek istediğinize emin misiniz?"
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

export default CreateTaskModal;