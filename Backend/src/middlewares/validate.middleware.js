const mongoose = require("mongoose");

const emailRegex = /^\S+@\S+\.\S+$/;

function validateRegister(req, res, next) {
  const { username, email, password } = req.body;

  if (!username?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: "Username, email and password are required" });
  }

  if (!emailRegex.test(email.trim().toLowerCase())) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  next();
}

function validateLogin(req, res, next) {
  const { username, email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if ((!username?.trim() && !email?.trim()) || !password) {
    return res.status(400).json({ message: "Username or email and password are required" });
  }

  if (normalizedEmail && !emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  next();
}

function validateMusicTitle(req, res, next) {
  if (!req.body.title?.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  next();
}

function validateAlbumPayload(req, res, next) {
  const { title, musics } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: "Album title is required" });
  }

  if (!Array.isArray(musics) || musics.length === 0) {
    return res.status(400).json({ message: "Please select at least one song" });
  }

  if (!musics.every((id) => mongoose.isValidObjectId(id))) {
    return res.status(400).json({ message: "Please provide valid music ids" });
  }

  next();
}

function validateAlbumId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.albumId)) {
    return res.status(400).json({ message: "Invalid album id" });
  }

  next();
}

function validateMusicIds(req, res, next) {
  const { musics } = req.body;

  if (!Array.isArray(musics) || musics.length === 0) {
    return res.status(400).json({ message: "Please provide music ids" });
  }

  if (!musics.every((id) => mongoose.isValidObjectId(id))) {
    return res.status(400).json({ message: "Please provide valid music ids" });
  }

  next();
}

function validatePagination(req, res, next) {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 8;

  if (!Number.isInteger(page) || page < 1) {
    return res.status(400).json({ message: "Page must be a positive number" });
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    return res.status(400).json({ message: "Limit must be between 1 and 50" });
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateMusicTitle,
  validateAlbumPayload,
  validateAlbumId,
  validateMusicIds,
  validatePagination,
};
