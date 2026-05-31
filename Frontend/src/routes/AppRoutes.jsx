import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Albums from "../pages/Albums";
import AlbumDetails from "../pages/AlbumDetails";
import UploadMusic from "../pages/UploadMusic";
import CreateAlbum from "../pages/CreateAlbum";
import ProtectedArtistRoute from "./ProtectedArtistRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* Common Routes */}
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/albums"
        element={<Albums />}
      />

      <Route
        path="/albums/:albumId"
        element={<AlbumDetails />}
      />

      {/* Artist Only Routes */}
      <Route
        path="/upload"
        element={
          <ProtectedArtistRoute>
            <UploadMusic />
          </ProtectedArtistRoute>
        }
      />

      <Route
        path="/create-album"
        element={
          <ProtectedArtistRoute>
            <CreateAlbum />
          </ProtectedArtistRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-black flex items-center justify-center">
            <h1 className="text-white text-3xl font-bold">
              404 - Page Not Found
            </h1>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;