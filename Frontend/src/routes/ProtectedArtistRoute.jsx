import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedArtistRoute({ children }) {
  const { user } = useAuth();

  // Login nahi hai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Artist nahi hai
  if (user.role !== "artist") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedArtistRoute;