import { FaPlay } from "react-icons/fa";
import { useMusic } from "../hooks/useMusic";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function MusicCard({ music, songs = [] }) {
  const { playSong } = useMusic();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlay = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    playSong(music, songs);
  };

  return (
    <div className="group bg-zinc-900/80 p-3 rounded-lg hover:bg-zinc-800 transition duration-200">
      <div className="relative aspect-square overflow-hidden rounded-md bg-zinc-800 shadow-lg">
        <img
          src={music.coverImage || "/default-cover.svg"}
          alt={music.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <button
          onClick={handlePlay}
          className="cursor-pointer absolute bottom-3 right-3 h-12 w-12 bg-green-500 hover:bg-green-400 rounded-full text-black shadow-xl flex items-center justify-center opacity-100 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition"
        >
          <FaPlay />
        </button>
      </div>

      <h2 className="text-white mt-3 font-semibold truncate">
        {music.title}
      </h2>
    </div>
  );
}

export default MusicCard;
