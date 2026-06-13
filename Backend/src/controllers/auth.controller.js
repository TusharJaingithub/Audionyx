const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  const { username, email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username: username.trim() }, { email: normalizedEmail }],
  });
  if (isUserAlreadyExists) {
    return res.status(409).json({ message: "User already exists" });
  }
  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username: username.trim(),
    email: normalizedEmail,
    password: hash,
    role: "user",
  });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  const isProd = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  };

  res.cookie("token", token, cookieOptions)
    .status(201)
    .json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
}

async function loginUser(req, res) {
  const { username, email, password, remember } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  const loginFilters = [];

  if (username?.trim()) {
    loginFilters.push({ username: username.trim() });
  }

  if (normalizedEmail) {
    loginFilters.push({ email: normalizedEmail });
  }

  const user = await userModel.findOne({
    $or: loginFilters,
  });
  if (!user) {
    return res.status(401).json({
      message: "Invalid Credentials",
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid Credentials",
    });
  }

  const expiresIn = remember ? "30d" : "1d";
  const maxAge = remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn,
    },
  );
  const isProd = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge,
  };

  res.cookie("token", token, cookieOptions).status(200)
    .json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
}

async function logoutUser(req, res) {
  const isProd = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  };

  res.clearCookie("token", cookieOptions).status(200).json({ message: "User logged out successfully" });
}

module.exports = { registerUser, loginUser, logoutUser };
