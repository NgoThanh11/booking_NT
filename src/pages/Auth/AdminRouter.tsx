import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const token = localStorage.getItem("accessToken");
  const userData = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userData);

  if (user.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}