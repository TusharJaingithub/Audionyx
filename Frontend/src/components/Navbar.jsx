import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useMusic } from "../hooks/useMusic";
import { logoutUser } from "../api/authApi";
import { FaChevronLeft, FaChevronRight, FaSearch, FaSignOutAlt } from "react-icons/fa";

function Navbar({ searchTerm, setSearchTerm, onSearch }) {
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
    <div className="bg-zinc-950/90 backdrop-blur flex flex-col md:flex-row justify-between items-center gap-3 px-4 py-3 border-b border-zinc-800">
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

        <h2 className="text-white text-xl font-semibold">
          Welcome
        </h2>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-2 w-full max-w-2xl">
          <FaSearch className="text-zinc-500" />
          <input
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm?.(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
            placeholder="Search songs by title..."
            className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
          />
          <button
            onClick={onSearch}
            className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-full font-semibold"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-4 py-2 rounded-full text-white font-semibold shadow-lg shadow-red-500/20 transition-all duration-200"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
