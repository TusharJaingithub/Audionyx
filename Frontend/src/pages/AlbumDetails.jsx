import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import { getAlbumById } from "../api/musicApi";
import { useMusic } from "../hooks/useMusic";
import { useAuth } from "../hooks/useAuth";

function AlbumDetails() {
  const { albumId } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);

  const { playSong } = useMusic();
  const { user } = useAuth();

  const handlePlaySong = (music) => {
    if (!user) {
      navigate("/login");
      return;
    }

    playSong(music, album.musics);
  };

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const data = await getAlbumById(albumId);
        setAlbum(data.album);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAlbum();
  }, [albumId]);

  if (!album) {
    return (
      <MainLayout>
        <div className="min-h-[240px] flex items-center justify-center">
          <p className="text-gray-400">
            Loading album...
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-0 flex-1 flex flex-col">
        <section className="rounded-lg bg-gradient-to-b from-emerald-700 via-zinc-900 to-black p-4 md:p-6 mb-5 shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <img
              src={album.coverImage || "/default-cover.svg"}
              alt={album.title}
              className="h-36 w-36 md:h-44 md:w-44 rounded-lg object-cover shadow-2xl bg-zinc-800"
            />

            <div>
              <p className="text-white text-sm font-semibold mb-2">
                Album
              </p>

              <h1 className="text-4xl md:text-6xl text-white font-black mb-3">
                {album.title}
              </h1>

              <p className="text-gray-300 text-sm">
                {album.musics.length} songs
              </p>
            </div>
          </div>
        </section>

        <div className="scrollbar-hidden overflow-y-auto scroll-smooth overscroll-contain min-h-0 flex-1 pb-32 md:pb-28">
          <div className="grid grid-cols-[40px_1fr_56px] gap-4 px-3 py-2 text-gray-400 text-sm border-b border-zinc-800">
            <span>#</span>
            <span>Title</span>
            <span className="text-center">
              Play
            </span>
          </div>

          <div className="space-y-2 pt-2">
            {album.musics.map((music, index) => (
              <div
                key={music._id}
                className="group grid grid-cols-[40px_1fr_56px] gap-4 items-center bg-zinc-900/70 hover:bg-zinc-800 rounded-lg px-3 py-3 transition"
              >
                <span className="text-gray-400 group-hover:text-white">
                  {index + 1}
                </span>

                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={
                      music.coverImage ||
                      "/default-cover.svg"
                    }
                    alt={music.title}
                    className="h-14 w-14 rounded-md object-cover bg-zinc-700 shadow"
                  />

                  <h2 className="text-white font-medium truncate">
                    {music.title}
                  </h2>
                </div>

                <button
                  onClick={() =>
                    handlePlaySong(music)
                  }
                  className="cursor-pointer h-11 w-11 rounded-full bg-green-500 hover:bg-green-400 text-black flex items-center justify-center shadow-lg transition hover:scale-105"
                >
                  <FaPlay />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default AlbumDetails;
