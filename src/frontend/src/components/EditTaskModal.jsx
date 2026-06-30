import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import ConfirmDialog from "./ConfirmDialog";

function EditTaskModal({ task, onClose, onUpdated }) {
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState(task.title);
  const [assignedUserId, setAssignedUserId] = useState(task.assignedUserId);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate.split("T")[0]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [confirmEdit, setConfirmEdit] = useState(false);

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

  async function handleUpdate() {
    try {
      await axiosInstance.put(`/tasks/${task.id}`, {
        title,
        description,
        assignedUserId: Number(assignedUserId),
        priority,
        dueDate,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError("Görev güncellenemedi.");
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
        <h3>Görev Düzenle</h3>

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
          <button onClick={onClose}>İptal</button>
          <button onClick={handleUpdateClick}>Düzenle</button>
        </div>
      </div>

      {confirmEdit && (
        <ConfirmDialog
          message="Düzenlemeyi onaylıyor musunuz"
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

export default EditTaskModal;