import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await axiosInstance.get("/dashboard/summary");
        setSummary(response.data.data);
      } catch (err) {
        setError("Dashboard verileri yüklenemedi.");
      }
    }

    fetchSummary();
  }, []);

  if (error) return <div>{error}</div>;
  if (!summary) return <div>Yükleniyor...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <p>Toplam Görev Sayısı</p>
          <h3>{summary.totalTasks}</h3>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <p>Tamamlanan Görev Sayısı</p>
          <h3>{summary.completedTasks}</h3>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <p>Bekleyen Görev Sayısı</p>
          <h3>{summary.pendingTasks}</h3>
        </div>
      </div>

      <h3>Kullanıcı Bazlı Görev Dağılımı</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Personel Adı
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Tamamlanan
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Bekleyen
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Toplam
            </th>
          </tr>
        </thead>
        <tbody>
          {summary.userSummaries.map((u, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {u.fullName}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {u.completed}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {u.pending}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {u.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;