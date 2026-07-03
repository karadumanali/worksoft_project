import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SnackbarProvider } from "./context/SnackbarContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Announcements from "./pages/Announcements";
import Users from "./pages/Users";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["Admin", "Yönetici"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/announcements"
              element={
                <ProtectedRoute>
                  <Announcements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <Users />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;