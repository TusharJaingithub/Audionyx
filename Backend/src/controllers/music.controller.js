const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");
const jwt = require("jsonwebtoken");

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
      title,
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
    const firstMusic = await musicModel.findById(musics?.[0]);

    if (!firstMusic) {
      return res.status(400).json({
        message: "Please select a valid song",
      });
    }

    const album = await albumModel.create({
      title,
      coverImage: firstMusic.coverImage,
      artist: req.user.id,
      musics: musics,
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


async function getAllMusics(req,res){
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  const [musics, total] = await Promise.all([
    musicModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate("artist","username email"),
    musicModel.countDocuments(),
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
  const albums= await albumModel.find().select("title coverImage artist").populate("artist","username email")
  res.status(200).json({
    message:"Albums fetched successfully",
    albums:albums
})
}

async function getAlbumById(req,res){
  const  albumId  = req.params.albumId;
  const album= await albumModel.findById(albumId).populate("artist","username email").populate("musics")
  return res.status(200).json({
    message:"Album fetched successfully",
    album:album
})
}

module.exports = { createMusic, createAlbum ,getAllMusics, getAllAlbums, getAlbumById };
