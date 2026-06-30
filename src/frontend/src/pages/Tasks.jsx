import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import ConfirmDialog from "../components/ConfirmDialog";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  const isPersonel = user.role === "Personel";

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const endpoint = isPersonel ? "/tasks/my" : "/tasks";
      const response = await axiosInstance.get(endpoint);
      setTasks(response.data.data);
    } catch (err) {
      setError("Görevler yüklenemedi.");
    }
  }

  async function handleStatusChange(taskId, newStatus) {
    try {
      await axiosInstance.put(`/tasks/${taskId}/status`, {
        status: newStatus,
      });
      fetchTasks();
    } catch (err) {
      setError("Durum güncellenemedi.");
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
        <h2>Görev Yönetimi</h2>
        {!isPersonel && (
        <button onClick={() => setShowModal(true)}>+ Yeni Görev Oluştur</button>
        )}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Görev Başlığı</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Atanan Kişi</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Öncelik</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Bitiş Tarihi</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Durum</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{task.title}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{task.assignedUserName}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{task.priority}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {new Date(task.dueDate).toLocaleDateString("tr-TR")}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                >
                  <option value="Bekliyor">Bekliyor</option>
                  <option value="Başladı">Başladı</option>
                  <option value="Tamamlandı">Tamamlandı</option>
                </select>
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {!isPersonel && (
                  <>
                    <button onClick={() => setEditingTask(task)}>Düzenle</button>
                    <button onClick={() => setDeletingTask(task)}>Sil</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <CreateTaskModal
            onClose={() => setShowModal(false)}
            onCreated={fetchTasks}
        />
        )}

        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onUpdated={fetchTasks}
          />
        )}

        {deletingTask && (
          <ConfirmDialog
            message={`"${deletingTask.title}" adlı görevi "${deletingTask.assignedUserName}" kişisinden silmek istediğinize emin misiniz?`}
            onConfirm={async () => {
              try {
                await axiosInstance.delete(`/tasks/${deletingTask.id}`);
                fetchTasks();
              } catch (err) {
                setError("Görev silinemedi.");
              }
              setDeletingTask(null);
            }}
            onCancel={() => setDeletingTask(null)}
          />
        )}
    </div>
  );
}

export default Tasks;