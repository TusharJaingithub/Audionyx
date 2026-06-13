const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");

async function createMusic(req, res) {
    const { title } = req.body;
    const file = req.files?.music?.[0];
    const coverImage = req.files?.coverImage?.[0];

    if (!file) {
      return res.status(400).json({
        message: "Please upload music file",
      });
    }

    if (!coverImage) {
      return res.status(400).json({
        message: "Please upload cover image",
      });
    }

    const result = await uploadFile(file.buffer.toString("base64"), "music");
    const coverImageResult = await uploadFile(coverImage.buffer.toString("base64"), "cover");

    const music = await musicModel.create({
      uri: result.url,
      title: title.trim(),
      coverImage: coverImageResult.url,
      artist: req.user.id,
    });
    res.status(201).json({
      message: "Music created successfully",
      music: {
        id: music._id,
        uri: music.uri,
        title: music.title,
        coverImage: music.coverImage,
        artist: music.artist,
      },
    });
 
}

async function createAlbum(req, res) {
    const { title, musics } = req.body;
    const uniqueMusicIds = [...new Set(musics)];
    const albumMusics = await musicModel
      .find({ _id: { $in: uniqueMusicIds }, artist: req.user.id })
      .select("_id coverImage");

    if (albumMusics.length !== uniqueMusicIds.length) {
      return res.status(400).json({
        message: "Please select valid songs from your library",
      });
    }

    const firstMusic = albumMusics.find((music) => String(music._id) === String(musics[0]));
    const coverImage = firstMusic.coverImage || "/default-cover.svg";

    const album = await albumModel.create({
      title: title.trim(),
      coverImage: coverImage,
      artist: req.user.id,
      musics: uniqueMusicIds,
    });
    res.status(201).json({
      message: "Album created successfully",
      album: {
        id: album._id,
        title: album.title,
        coverImage: album.coverImage,
        artist: album.artist,
        musics: album.musics,
      },
    });
  
}


async function uploadMusicToAlbum(req, res) {
  const albumId = req.params.albumId;
  const { title } = req.body;
  const file = req.files?.music?.[0];
  const coverImage = req.files?.coverImage?.[0];

  if (!file) {
    return res.status(400).json({ message: "Please upload music file" });
  }

  const album = await albumModel.findById(albumId);
  if (!album) {
    return res.status(404).json({ message: "Album not found" });
  }

  // Only album owner (artist) can add songs
  if (String(album.artist) !== String(req.user.id)) {
    return res.status(403).json({ message: "Not authorized to modify this album" });
  }

  const result = await uploadFile(file.buffer.toString("base64"), "music");

  let coverUrl = album.coverImage || "/default-cover.svg";
  if (coverImage) {
    const coverResult = await uploadFile(coverImage.buffer.toString("base64"), "cover");
    coverUrl = coverResult.url;
  }

  const music = await musicModel.create({
    uri: result.url,
    title: title.trim(),
    coverImage: coverUrl,
    artist: req.user.id,
  });

  album.musics.push(music._id);
  await album.save();

  return res.status(201).json({
    message: "Music added to album successfully",
    music: {
      id: music._id,
      uri: music.uri,
      title: music.title,
      coverImage: music.coverImage,
      artist: music.artist,
    },
    album,
  });
}


async function getAllMusics(req,res){
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 8;
  const skip = (page - 1) * limit;
  const search = req.query.search?.trim();

  const filter = {};
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const [musics, total] = await Promise.all([
    musicModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("artist","username email"),
    musicModel.countDocuments(filter),
  ]);

  res.status(200).json({
    message:"Musics fetched successfully",
    musics:musics,
    pagination:{
      page,
      limit,
      total,
      hasMore: skip + musics.length < total,
    }
})
}

async function getAllAlbums(req,res){
  const albums= await albumModel.find().sort({ createdAt: -1 }).select("title coverImage artist").populate("artist","username email")
  res.status(200).json({
    message:"Albums fetched successfully",
    albums:albums
})
}

async function getAlbumById(req,res){
  const  albumId  = req.params.albumId;
  const album= await albumModel.findById(albumId).populate("artist","username email").populate("musics")
  if (!album) {
    return res.status(404).json({ message: "Album not found" });
  }

  return res.status(200).json({
    message:"Album fetched successfully",
    album:album
})
}

async function getMusicsByArtist(req, res) {
  const artistId = req.user.id;
  const musics = await musicModel.find({ artist: artistId }).select("title coverImage uri");
  return res.status(200).json({ message: "Artist musics fetched", musics });
}

async function addExistingMusicsToAlbum(req, res) {
  const albumId = req.params.albumId;
  const { musics } = req.body;

  const album = await albumModel.findById(albumId);
  if (!album) {
    return res.status(404).json({ message: "Album not found" });
  }

  if (String(album.artist) !== String(req.user.id)) {
    return res.status(403).json({ message: "Not authorized to modify this album" });
  }

  const uniqueMusicIds = [...new Set(musics)];
  const existingSongs = await musicModel
    .find({ _id: { $in: uniqueMusicIds }, artist: req.user.id })
    .select("_id");
  const existingSongIds = new Set(existingSongs.map((music) => String(music._id)));
  const albumSongIds = new Set(album.musics.map((music) => String(music)));
  const validIds = uniqueMusicIds.filter((id) => existingSongIds.has(String(id)) && !albumSongIds.has(String(id)));

  if (validIds.length === 0) {
    return res.status(400).json({ message: "No valid songs to add" });
  }

  album.musics.push(...validIds);
  await album.save();

  await album.populate("musics");

  return res.status(200).json({ message: "Songs added to album", album });
}

async function reorderAlbumTracks(req, res) {
  const albumId = req.params.albumId;
  const { musics } = req.body;

  const album = await albumModel.findById(albumId);
  if (!album) {
    return res.status(404).json({ message: "Album not found" });
  }

  // Only album owner can reorder
  if (String(album.artist) !== String(req.user.id)) {
    return res.status(403).json({ message: "Not authorized to modify this album" });
  }

  const currentIds = album.musics.map((id) => String(id));
  const requestedIds = musics.map((id) => String(id));
  const hasSameTracks =
    currentIds.length === requestedIds.length &&
    currentIds.every((id) => requestedIds.includes(id));

  if (!hasSameTracks) {
    return res.status(400).json({ message: "Album order must include the same songs" });
  }

  album.musics = musics;
  await album.save();

  await album.populate("musics");

  return res.status(200).json({ message: "Album order updated", album });
}

module.exports = {
  createMusic,
  createAlbum,
  uploadMusicToAlbum,
  getAllMusics,
  getAllAlbums,
  getAlbumById,
  getMusicsByArtist,
  addExistingMusicsToAlbum,
  reorderAlbumTracks,
};
