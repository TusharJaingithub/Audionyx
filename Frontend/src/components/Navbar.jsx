import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useMusic } from "../hooks/useMusic";
import { logoutUser } from "../api/authApi";
import { FaChevronLeft, FaChevronRight, FaSearch, FaSignOutAlt } from "react-icons/fa";

function Navbar({ searchTerm, setSearchTerm, onSearch }) {
  const { logout, user } = useAuth();
  const { clearPlayer, playNext, playPrevious, hasNext, hasPrevious } = useMusic();

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
    <div className="bg-zinc-950/90 backdrop-blur flex items-center justify-between gap-3 px-3 py-2 border-b border-zinc-800">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => playPrevious()}
          disabled={!hasPrevious}
          className={`cursor-pointer h-8 w-8 rounded-full bg-black text-gray-300 flex items-center justify-center ${!hasPrevious ? 'opacity-40 pointer-events-none' : ''}`}
          aria-label="Previous"
        >
          <FaChevronLeft />
        </button>

        <button
          type="button"
          onClick={() => playNext()}
          disabled={!hasNext}
          className={`cursor-pointer h-8 w-8 rounded-full bg-black text-gray-300 flex items-center justify-center ${!hasNext ? 'opacity-40 pointer-events-none' : ''}`}
          aria-label="Next"
        >
          <FaChevronRight />
        </button>

        <h2 className="hidden sm:block text-white text-lg font-semibold">
          Welcome
        </h2>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-2 py-1 w-full max-w-xs sm:max-w-md md:max-w-2xl">
          <FaSearch className="text-zinc-500" />
          <input
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm?.(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
            placeholder="Search songs by title..."
            className="w-full bg-transparent text-white text-sm outline-none placeholder:text-zinc-500"
          />
          <button
            onClick={onSearch}
            className="cursor-pointer bg-green-500 hover:bg-green-400 text-black px-3 py-1 rounded-full font-semibold text-sm transition duration-150"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <button
            onClick={handleLogout}
            className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-4 py-2 rounded-full text-white font-semibold shadow-lg shadow-red-500/20 transition-all duration-200"
          >
            <FaSignOutAlt />
            Logout
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="cursor-pointer px-4 py-2 rounded-full bg-green-600 hover:bg-green-500 text-white font-semibold text-sm"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="cursor-pointer px-3 py-2 rounded-full border border-zinc-800 text-white text-sm hover:bg-zinc-800 hover:border-zinc-700 transition duration-150"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
