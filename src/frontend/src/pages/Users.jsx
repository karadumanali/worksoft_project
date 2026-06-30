import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

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
        <h2>Kullanıcı Yönetimi</h2>
        <button>+ Yeni Kullanıcı Ekle</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Kullanıcı Bilgisi</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Rolü</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Kayıt Tarihi</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Hesap Durumu</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <strong>{u.fullName}</strong>
                <br />
                <span style={{ color: "#888" }}>{u.email}</span>
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{u.role}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {new Date(u.createdDate).toLocaleDateString("tr-TR")}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {u.isActive ? "Aktif" : "Pasif"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;