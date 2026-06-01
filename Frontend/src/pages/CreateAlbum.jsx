import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  getAllMusics,
  createAlbum,
} from "../api/musicApi";

function CreateAlbum() {
  const [title, setTitle] = useState("");
  const [musics, setMusics] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const data = await getAllMusics({
        page: 1,
        limit: 100,
      });
      setMusics(data.musics);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleSong = (id) => {
    if (selectedSongs.includes(id)) {
      setSelectedSongs(
        selectedSongs.filter(
          (songId) => songId !== id
        )
      );
    } else {
      setSelectedSongs([
        ...selectedSongs,
        id,
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return alert(
        "Please enter album title"
      );
    }

    if (selectedSongs.length === 0) {
      return alert(
        "Please select at least one song"
      );
    }

    try {
      await createAlbum({
        title,
        musics: selectedSongs,
      });

      alert(
        "Album Created Successfully"
      );

      setTitle("");
      setSelectedSongs([]);
    } catch (err) {
      console.log(err);
      alert("Failed to create album");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl pb-40 md:pb-0">
        <h1 className="text-3xl text-white font-bold mb-6">
          Create Album
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 p-6 rounded-xl"
        >
          <input
            type="text"
            placeholder="Album Name"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full p-3 rounded bg-zinc-800 text-white mb-6 outline-none"
          />

          <h2 className="text-xl text-white mb-4">
            Select Songs
          </h2>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {musics.map((music) => (
              <label
                key={music._id}
                className="flex items-center gap-3 text-white bg-zinc-800 p-3 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSongs.includes(
                    music._id
                  )}
                  onChange={() =>
                    toggleSong(music._id)
                  }
                />

                <span>
                  {music.title}
                </span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded text-white font-semibold"
          >
            Create Album
          </button>
        </form>
      </div>
    </MainLayout>
  );
}

export default CreateAlbum;
