import api from "./axios";

// Get all songs
export const getAllMusics = async ({
  page = 1,
  limit = 8,
  search = "",
} = {}) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    query.append("search", search);
  }

  const response = await api.get(`/music?${query.toString()}`);
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
