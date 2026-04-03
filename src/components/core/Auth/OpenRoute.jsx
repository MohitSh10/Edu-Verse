// OpenRoute.jsx — redirect to dashboard if already logged in
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function OpenRoute({ children }) {
  const { token } = useSelector((s) => s.auth);
  return token ? <Navigate to="/dashboard/my-profile" replace /> : children;
}
