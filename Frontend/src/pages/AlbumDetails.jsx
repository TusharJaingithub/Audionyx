import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import { getAlbumById, uploadMusicToAlbum, getAllMusics, addExistingMusicsToAlbum, reorderAlbumTracks } from "../api/musicApi";
import { toast } from "react-hot-toast";
import { useRef } from "react";
import { useMusic } from "../hooks/useMusic";
import { useAuth } from "../hooks/useAuth";

function AlbumDetails() {
  const { albumId } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);

  const { playSong } = useMusic();
  const { user } = useAuth();
  const [newTitle, setNewTitle] = useState("");
  const [newMusicFile, setNewMusicFile] = useState(null);
  const [newCoverFile, setNewCoverFile] = useState(null);
  const [adding, setAdding] = useState(false);
  const musicInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [artistMusics, setArtistMusics] = useState([]);
  const [selectedExisting, setSelectedExisting] = useState([]);
  const [addingExisting, setAddingExisting] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerResults, setPickerResults] = useState([]);
  const [pickerPage, setPickerPage] = useState(1);
  const [pickerHasMore, setPickerHasMore] = useState(false);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");

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

  useEffect(() => {
    const loadAllMusics = async () => {
      try {
        const data = await getAllMusics({ page: 1, limit: 1000 });
        setArtistMusics(data.musics || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadAllMusics();
  }, []);

  const handleAddToAlbum = async (e) => {
    e.preventDefault();
    if (!newTitle || !newMusicFile) {
      toast.error("Please provide title and music file");
      return;
    }
    setAdding(true);
    try {
      const form = new FormData();
      form.append("title", newTitle);
      form.append("music", newMusicFile);
      if (newCoverFile) form.append("coverImage", newCoverFile);

      await uploadMusicToAlbum(albumId, form);
      toast.success("Song added to album");
      setNewTitle("");
      setNewMusicFile(null);
      setNewCoverFile(null);
      if (musicInputRef.current) musicInputRef.current.value = null;
      if (coverInputRef.current) coverInputRef.current.value = null;
      // refresh album
      const data = await getAlbumById(albumId);
      setAlbum(data.album);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add song to album");
    } finally {
      setAdding(false);
    }
  };

  const handleToggleExisting = (id) => {
    setSelectedExisting((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      return [...s, id];
    });
  };

  const handleAddExisting = async (e) => {
    e.preventDefault();
    if (selectedExisting.length === 0) {
      toast.error("Select at least one song to add");
      return;
    }
    setAddingExisting(true);
    try {
      await addExistingMusicsToAlbum(albumId, selectedExisting);
      toast.success("Songs added to album");
      setSelectedExisting([]);
      // refresh album
      const data = await getAlbumById(albumId);
      setAlbum(data.album);
      // refresh all musics (to update available list)
      const all = await getAllMusics({ page: 1, limit: 1000 });
      setArtistMusics(all.musics || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add songs");
    } finally {
      setAddingExisting(false);
    }
  };

  // Drag and drop handlers for reordering
  const onDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = async (e, index) => {
    e.preventDefault();
    if (dragIndex === null || !album) return;
    const items = Array.from(album.musics);
    const [moved] = items.splice(dragIndex, 1);
    items.splice(index, 0, moved);
    // update local state immediately
    setAlbum((prev) => ({ ...prev, musics: items }));
    setDragIndex(null);
    // persist order
    try {
      const ids = items.map((m) => m._id || m.id);
      await reorderAlbumTracks(albumId, ids);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save order");
      // revert by refetch
      const data = await getAlbumById(albumId);
      setAlbum(data.album);
    }
  };

  // Picker load
  const loadPicker = async (page = 1, search = "") => {
    setPickerLoading(true);
    try {
      const data = await getAllMusics({ page, limit: 12, search });
      if (page === 1) setPickerResults(data.musics || []);
      else setPickerResults((prev) => [...prev, ...(data.musics || [])]);
      setPickerHasMore(data.pagination?.hasMore || false);
      setPickerPage(page);
    } catch (err) {
      console.error(err);
    } finally {
      setPickerLoading(false);
    }
  };

  const openPicker = () => {
    setPickerOpen(true);
    setPickerSearch("");
    loadPicker(1, "");
  };

  const loadMorePicker = () => {
    if (!pickerHasMore) return;
    loadPicker(pickerPage + 1, pickerSearch);
  };

  const handlePickerSearch = (val) => {
    setPickerSearch(val);
    loadPicker(1, val);
  };

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
                draggable={user?.role === "artist" && String(user?.id) === String(album.artist?._id)}
                onDragStart={(e) => onDragStart(e, index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDrop={(e) => onDrop(e, index)}
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
          <div className="mt-4">
            {user?.role === "artist" && String(user?.id) === String(album.artist?._id) && (
              <div className="flex gap-2">
                <button onClick={openPicker} className="px-3 py-2 bg-green-500 rounded text-black">Open song picker</button>
              </div>
            )}
          </div>
          {user?.role === "artist" && String(user?.id) === String(album.artist?._id) && (
            <div className="mt-6 p-4 bg-zinc-900 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Add new song to this album</h3>
              <form onSubmit={handleAddToAlbum} className="flex flex-col gap-2">
                <input
                  placeholder="Song title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="p-2 rounded bg-zinc-800 text-white"
                />

                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setNewMusicFile(e.target.files[0])}
                  ref={musicInputRef}
                  className="text-sm"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewCoverFile(e.target.files[0])}
                  ref={coverInputRef}
                  className="text-sm"
                />

                <button
                  disabled={adding}
                  className="mt-2 bg-green-500 hover:bg-green-400 text-black py-2 rounded"
                >
                  {adding ? "Adding..." : "Add to Album"}
                </button>
              </form>
            </div>
          )}
          {user?.role === "artist" && String(user?.id) === String(album.artist?._id) && (
            <div className="mt-6 p-4 bg-zinc-900 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Add existing songs</h3>
              <form onSubmit={handleAddExisting} className="flex flex-col gap-2">
                <p className="text-gray-400 text-sm">Select from your uploaded songs (those already in the album are hidden)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-auto mt-2">
                  {artistMusics
                    .filter((m) => !album.musics.find((am) => String(am._id) === String(m._id)))
                    .map((m) => (
                      <label key={m._id} className="flex items-center gap-2 p-2 bg-zinc-800 rounded">
                        <input type="checkbox" checked={selectedExisting.includes(m._id)} onChange={() => handleToggleExisting(m._id)} />
                        <img src={m.coverImage || "/default-cover.svg"} alt={m.title} className="h-10 w-10 rounded object-cover" />
                        <span className="text-white truncate">{m.title}</span>
                      </label>
                    ))}
                </div>
                <button disabled={addingExisting} className="mt-2 bg-green-500 hover:bg-green-400 text-black py-2 rounded">
                  {addingExisting ? "Adding..." : "Add selected songs"}
                </button>
              </form>
            </div>
          )}
          {pickerOpen && (
            <div className="fixed inset-0 bg-black/60 flex items-start justify-center p-4 z-50">
              <div className="w-full max-w-3xl bg-zinc-900 rounded p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <input
                    value={pickerSearch}
                    onChange={(e) => handlePickerSearch(e.target.value)}
                    placeholder="Search songs..."
                    className="flex-1 p-2 rounded bg-zinc-800 text-white"
                  />
                  <button onClick={() => setPickerOpen(false)} className="ml-2 px-3 py-2 bg-zinc-700 rounded">Close</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-auto">
                  {pickerResults.map((m) => (
                    <label key={m._id} className="flex items-center gap-2 p-2 bg-zinc-800 rounded">
                      <input type="checkbox" checked={selectedExisting.includes(m._id)} onChange={() => handleToggleExisting(m._id)} />
                      <img src={m.coverImage || "/default-cover.svg"} alt={m.title} className="h-10 w-10 rounded object-cover" />
                      <span className="text-white truncate">{m.title}</span>
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div>
                    {pickerHasMore && (
                      <button onClick={loadMorePicker} className="px-3 py-2 bg-zinc-700 rounded">Load more</button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedExisting([]); }} className="px-3 py-2 bg-zinc-700 rounded">Clear</button>
                    <button onClick={handleAddExisting} disabled={addingExisting} className="px-3 py-2 bg-green-500 rounded text-black">{addingExisting ? 'Adding...' : 'Add selected'}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default AlbumDetails;
