import { useState } from "react";
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
  const [confirmCreate, setConfirmCreate] = useState(false);

  async function handleCreate() {
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
    }
  }

  function handleCreateClick() {
    setConfirmCreate(true);
  }

  const selectedRoleName = roleOptions.find((r) => r.id === Number(roleId))?.name;

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
        <h3>Yeni Kullanıcı Ekle</h3>

        <div style={{ marginBottom: "10px" }}>
          <label>Ad-Soyad</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Geçici Parola</label>
          <input
            type="text"
            value={tempPassword}
            onChange={(e) => setTempPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Kullanıcı Rolü</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            style={{ width: "100%" }}
          >
            {roleOptions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            {" "}Kullanıcı hemen aktif edilsin mi?
          </label>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose}>İptal</button>
          <button onClick={handleCreateClick}>Oluştur</button>
        </div>
      </div>

      {confirmCreate && (
        <ConfirmDialog
          message={`"${fullName}" adlı kullanıcıyı "${selectedRoleName}" rolünde eklemek istediğinize emin misiniz?`}
          onConfirm={() => {
            setConfirmCreate(false);
            handleCreate();
          }}
          onCancel={() => setConfirmCreate(false)}
        />
      )}
    </div>
  );
}

export default CreateUserModal;