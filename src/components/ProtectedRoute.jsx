import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const activeUser = localStorage.getItem("flowstate_active_user");

  if (!activeUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}