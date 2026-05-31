import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import AlbumCard from "../components/AlbumCard";
import { getAllAlbums } from "../api/musicApi";

function Albums() {
  const [albums, setAlbums] = useState([]);

 useEffect(() => {
  async function loadAlbums() {
    try {
      const data = await getAllAlbums();
      setAlbums(data.albums);
    } catch (err) {
      console.log(err);
    }
  }

  loadAlbums();
}, []);

  return (
    <MainLayout>
      <div className="min-h-0 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-5 shrink-0">
          <h1 className="text-3xl text-white font-bold">
            Albums
          </h1>

          <span className="text-gray-400 text-sm">
            {albums.length} albums
          </span>
        </div>

        <div className="scrollbar-hidden overflow-y-auto min-h-0 flex-1 pb-32 md:pb-28">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
            {albums.map((album) => (
              <AlbumCard
                key={album._id}
                album={album}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Albums;
