const express = require("express");
const authController = require("../controllers/auth.controller")
const asyncHandler = require("../utils/asyncHandler");
const { validateLogin, validateRegister } = require("../middlewares/validate.middleware");

const router = express.Router();

router.post("/register", validateRegister, asyncHandler(authController.registerUser))

router.post("/login", validateLogin, asyncHandler(authController.loginUser))

router.post("/logout", asyncHandler(authController.logoutUser))
module.exports= router;
