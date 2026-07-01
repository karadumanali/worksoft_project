import { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Table, TableHead, TableBody, TableRow, TableCell, Paper, CircularProgress } from "@mui/material";
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

  if (error) return <Typography color="error" sx={{ p: 3 }}>{error}</Typography>;
  if (!summary) return <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        {[
          { label: "Toplam Görev Sayısı", value: summary.totalTasks },
          { label: "Tamamlanan Görev Sayısı", value: summary.completedTasks },
          { label: "Bekleyen Görev Sayısı", value: summary.pendingTasks },
        ].map((item) => (
          <Card key={item.label} sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Kullanıcı Bazlı Görev Dağılımı
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Personel Adı</strong></TableCell>
              <TableCell align="center"><strong>Tamamlanan</strong></TableCell>
              <TableCell align="center"><strong>Bekleyen</strong></TableCell>
              <TableCell align="center"><strong>Toplam</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summary.userSummaries.map((u, index) => (
              <TableRow key={index}>
                <TableCell>{u.fullName}</TableCell>
                <TableCell align="center">{u.completed}</TableCell>
                <TableCell align="center">{u.pending}</TableCell>
                <TableCell align="center">{u.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default Dashboard;