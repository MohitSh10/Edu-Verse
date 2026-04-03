import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { token } = useSelector(s => s.auth);
  const { user } = useSelector(s => s.profile);
  if (!token) return <Navigate to="/login" replace />;
  if (user && user.accountType !== "Admin") return <Navigate to="/dashboard/my-profile" replace />;
  return children;
}
