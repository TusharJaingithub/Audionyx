import { Link } from "react-router-dom";

function AlbumCard({ album }) {
  return (
    <Link to={`/albums/${album._id}`}>
      <div className="group bg-zinc-900/80 p-3 rounded-lg hover:bg-zinc-800 transition duration-200">
        <div className="aspect-square overflow-hidden rounded-md bg-zinc-800 shadow-lg">
          <img
            src={album.coverImage || "/default-cover.svg"}
            alt={album.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <h2 className="text-white mt-3 font-semibold truncate">
          {album.title}
        </h2>
      </div>
    </Link>
  );
}

export default AlbumCard;
