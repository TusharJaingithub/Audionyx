import { useEffect, useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import MusicCard from "../components/MusicCard";
import { getAllMusics } from "../api/musicApi";
import { useMusic } from "../hooks/useMusic";
import { FaPlay } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Home() {
  const [musics, setMusics] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const { playSong } = useMusic();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlayTrending = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    playSong(musics[0], musics);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const loadMusics = async (pageNumber = 1) => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      const data = await getAllMusics({
        page: pageNumber,
        limit: 8,
        search: searchTerm,
      });

      setMusics((currentMusics) =>
        pageNumber === 1
          ? data.musics
          : [...currentMusics, ...data.musics]
      );
      setHasMore(
        data.pagination?.hasMore || false
      );
      setPage(pageNumber);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMusics(1);
  }, []);

  const handleScroll = () => {
    const list = listRef.current;

    if (!list || loading || !hasMore) {
      return;
    }

    const isNearBottom =
      list.scrollTop + list.clientHeight >=
      list.scrollHeight - 80;

    if (isNearBottom) {
      loadMusics(page + 1);
    }
  };

  return (
    <MainLayout
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onSearch={() => loadMusics(1)}
    >
      <div className="min-h-0 flex-1 flex flex-col">
      <section className="bg-gradient-to-b rounded-2xl from-emerald-700 via-zinc-900 to-black p-4 md:p-6 mb-3 shrink-0">
        <p className="text-xs md:text-sm text-white font-semibold mb-2">
          Welcome to Audionyx
        </p>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-white font-black mb-2">
          Music for your moment
        </h1>

        <p className="text-gray-200 text-sm max-w-2xl mb-3 hidden sm:block">
          Discover fresh tracks, play your favorites, and keep the queue moving.
        </p>

        {musics.length > 0 && (
          <button
            onClick={handlePlayTrending}
            className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded-full"
          >
            <FaPlay />
            Play trending
          </button>
        )}
      </section>


      <div className="flex items-center justify-between mb-3 px-4 md:px-6 shrink-0">
        <h2 className="text-2xl text-white font-bold">
          Trending Songs
        </h2>

        <span className="text-gray-400 text-sm">
          {musics.length} tracks
        </span>
      </div>

      {musics.length === 0 ? (
        <div className="min-h-[220px] flex items-center justify-center rounded-lg bg-zinc-900/60">
          <p className="text-gray-400">
            {loading ? "Loading songs..." : "No songs available"}
          </p>
        </div>
      ) : (
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="scrollbar-hidden overflow-y-auto scroll-smooth overscroll-contain px-4 md:px-6 pb-32 md:pb-28 min-h-[360px] flex-1"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
          {musics.map((music) => (
            <MusicCard
              key={music._id}
              music={music}
              songs={musics}
            />
          ))}
          </div>

          {loading && (
            <p className="text-gray-400 text-center py-4">
              Loading songs...
            </p>
          )}
        </div>
      )}
      </div>
    </MainLayout>
  );
}

export default Home;
