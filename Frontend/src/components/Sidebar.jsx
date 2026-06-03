import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FaHome,
  FaCompactDisc,
  FaUpload,
  FaPlus,
  FaHeadphones,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function Sidebar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full md:w-64 bg-black text-white p-3 md:p-5 border-b md:border-b-0 md:border-r border-zinc-800 shrink-0">
      <div className="flex items-center justify-between mb-3 md:mb-10">
        <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-green-500">
          <FaHeadphones />
          Audionyx
        </h1>
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden rounded-full border border-zinc-700 bg-zinc-900 p-2 text-zinc-200"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className={`${menuOpen ? "flex" : "hidden"} flex-col md:flex md:flex-col gap-2 overflow-x-auto`}>
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 rounded-md px-3 py-3 hover:bg-zinc-900 hover:text-green-500 whitespace-nowrap"
        >
          <FaHome />
          Home
        </Link>

        <Link
          to="/albums"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 rounded-md px-3 py-3 hover:bg-zinc-900 hover:text-green-500 whitespace-nowrap"
        >
          <FaCompactDisc />
          Albums
        </Link>

        {user?.role === "artist" && (
          <>
            <Link
              to="/upload"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-3 hover:bg-zinc-900 hover:text-green-500 whitespace-nowrap"
            >
              <FaUpload />
              Upload Music
            </Link>

            <Link
              to="/create-album"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-3 hover:bg-zinc-900 hover:text-green-500 whitespace-nowrap"
            >
              <FaPlus />
              Create Album
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
