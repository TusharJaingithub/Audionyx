import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { uploadMusic } from "../api/musicApi";
import toast from "react-hot-toast";

function UploadMusic() {
  const [title, setTitle] = useState("");
  const [music, setMusic] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return toast.error("Please enter song title");
    }

    if (!music) {
      return toast.error("Please select a music file");
    }

    if (!coverImage) {
      return toast.error("Please select a cover image");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("music", music);
      formData.append("coverImage", coverImage);

      await uploadMusic(formData);

      toast.success("Music uploaded successfully");

      setTitle("");
      setMusic(null);
      setCoverImage(null);
    } catch (err) {
      console.log(err);

      toast.error(
        err?.response?.data?.message ||
          "Upload Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-lg">
        <h1 className="text-3xl text-white font-bold mb-6">
          Upload Music
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 p-6 rounded-xl"
        >
          <input
            type="text"
            placeholder="Song Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full p-3 rounded bg-zinc-800 text-white mb-4 outline-none"
          />

          <label className="block text-white font-medium mb-2">
            Choose song
          </label>

          <input
            type="file"
            accept="audio/*"
            className="w-full text-white mb-4"
            onChange={(e) =>
              setMusic(e.target.files[0])
            }
          />

          {music && (
            <p className="text-gray-400 text-sm mb-4">
              Selected: {music.name}
            </p>
          )}

          <label className="block text-white font-medium mb-2">
            Choose cover image
          </label>

          <input
            type="file"
            accept="image/*"
            className="w-full text-white mb-4"
            onChange={(e) =>
              setCoverImage(e.target.files[0])
            }
          />

          {coverImage && (
            <div className="mb-4">
              <img
                src={URL.createObjectURL(coverImage)}
                alt="Cover preview"
                className="h-32 w-32 rounded object-cover mb-2"
              />
              <p className="text-gray-400 text-sm">
                Cover: {coverImage.name}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer bg-green-500 hover:bg-green-600 px-6 py-3 rounded text-white font-semibold disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? "Uploading..."
              : "Upload Music"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}

export default UploadMusic;
