import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ConfirmDialog from "./ConfirmDialog";

const roleOptions = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Yönetici" },
  { id: 3, name: "Personel" },
];

function EditUserModal({ targetUser, onClose, onUpdated }) {
  const currentRoleId = roleOptions.find((r) => r.name === targetUser.role)?.id || 3;

  const [email, setEmail] = useState(targetUser.email);
  const [roleId, setRoleId] = useState(currentRoleId);
  const [isActive, setIsActive] = useState(targetUser.isActive);
  const [resetPassword, setResetPassword] = useState(false);
  const [error, setError] = useState("");
  const [confirmEdit, setConfirmEdit] = useState(false);

  async function handleUpdate() {
    try {
      await axiosInstance.put(`/users/${targetUser.id}`, {
        email,
        roleId: Number(roleId),
        isActive,
        resetPassword,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError("Kullanıcı güncellenemedi.");
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
        <h3>Kullanıcıyı Düzenle</h3>
        <p style={{ fontStyle: "italic" }}>({targetUser.fullName})</p>

        <div style={{ marginBottom: "10px" }}>
          <label>Yeni e-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              checked={resetPassword}
              onChange={(e) => setResetPassword(e.target.checked)}
            />
            {" "}Kullanıcının Parolasını Sıfırla (Geçici parola e-posta ile iletilir)
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
          message={`"${targetUser.fullName}" adlı kullanıcı için değişiklikleri onaylıyor musunuz?`}
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

export default EditUserModal;