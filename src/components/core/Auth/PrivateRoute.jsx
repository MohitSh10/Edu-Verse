import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { token } = useSelector((s) => s.auth);
  const location = useLocation();
  return token
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
}
