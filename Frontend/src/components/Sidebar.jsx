import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FaHome,
  FaCompactDisc,
  FaUpload,
  FaPlus,
  FaHeadphones,
} from "react-icons/fa";

function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="w-full md:w-64 md:h-screen bg-black text-white p-3 md:p-5 border-b md:border-b-0 md:border-r border-zinc-800 shrink-0">
      <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-green-500 mb-3 md:mb-10">
        <FaHeadphones />
        Audionyx
      </h1>

      <div className="flex md:flex-col gap-2 overflow-x-auto">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-md px-3 py-3 hover:bg-zinc-900 hover:text-green-500 whitespace-nowrap"
        >
          <FaHome />
          Home
        </Link>

        <Link
          to="/albums"
          className="flex items-center gap-3 rounded-md px-3 py-3 hover:bg-zinc-900 hover:text-green-500 whitespace-nowrap"
        >
          <FaCompactDisc />
          Albums
        </Link>

        {user?.role === "artist" && (
          <>
            <Link
              to="/upload"
              className="flex items-center gap-3 rounded-md px-3 py-3 hover:bg-zinc-900 hover:text-green-500 whitespace-nowrap"
            >
              <FaUpload />
              Upload Music
            </Link>

            <Link
              to="/create-album"
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
