import api from "./axios";

// Get all songs
export const getAllMusics = async ({
  page = 1,
  limit = 8,
} = {}) => {
  const response = await api.get(
    `/music?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Get all albums
export const getAllAlbums = async () => {
  const response = await api.get("/music/albums");
  return response.data;
};

// Get album by id
export const getAlbumById = async (albumId) => {
  const response = await api.get(
    `/music/albums/${albumId}`
  );

  return response.data;
};

// Upload music
export const uploadMusic = async (formData) => {
  const response = await api.post(
    "/music/upload",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Create album
export const createAlbum = async (albumData) => {
  const response = await api.post(
    "/music/album",
    albumData
  );

  return response.data;
};
