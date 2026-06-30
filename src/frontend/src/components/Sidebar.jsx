import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const canSeeDashboard = user.role === "Admin" || user.role === "Yönetici";
  const canSeeUsers = user.role === "Admin";

  return (
    <div
      style={{
        width: "220px",
        minHeight: "100vh",
        background: "#1a2332",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>WORKSOFT</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {canSeeDashboard && (
          <Link to="/dashboard" style={{ color: "#fff" }}>
            Dashboard
          </Link>
        )}
        <Link to="/tasks" style={{ color: "#fff" }}>
          Görevler
        </Link>
        <Link to="/announcements" style={{ color: "#fff" }}>
          Duyurular
        </Link>
        {canSeeUsers && (
          <Link to="/users" style={{ color: "#fff" }}>
            Kullanıcılar
          </Link>
        )}
      </nav>

      <div style={{ marginTop: "40px" }}>
        <p>{user.fullName}</p>
        <button onClick={handleLogout}>Çıkış Yap</button>
      </div>
    </div>
  );
}

export default Sidebar;