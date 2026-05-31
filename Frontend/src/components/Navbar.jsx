import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useMusic } from "../hooks/useMusic";
import { logoutUser } from "../api/authApi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FaBus } from "react-icons/fa";

function Navbar() {
  const { logout } = useAuth();
  const { clearPlayer } = useMusic();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();

      clearPlayer();

      // User logout
      logout();

      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-zinc-950/90 backdrop-blur flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-3 border-b border-zinc-800">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="cursor-pointer h-9 w-9 rounded-full bg-black text-gray-300 flex items-center justify-center"
        >
          <FaChevronLeft />
        </button>

        <button
          type="button"
          className="cursor-pointer h-9 w-9 rounded-full bg-black text-gray-300 flex items-center justify-center"
        >
          <FaChevronRight />
        </button>

        <div className="flex items-center gap-2">
          <FaBus className="text-green-400" />
          <h2 className="text-white text-xl font-semibold">
            Welcome
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="cursor-pointer bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
