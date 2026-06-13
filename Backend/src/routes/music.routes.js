const express = require("express")
const musicController = require("../controllers/music.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const asyncHandler = require("../utils/asyncHandler")
const {
    validateAlbumId,
    validateAlbumPayload,
    validateMusicIds,
    validateMusicTitle,
    validatePagination,
} = require("../middlewares/validate.middleware")
const multer = require("multer")

const upload= multer({
    storage:multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const isMusic = file.fieldname === "music" && file.mimetype.startsWith("audio/");
        const isCover = file.fieldname === "coverImage" && file.mimetype.startsWith("image/");

        if (isMusic || isCover) {
            return cb(null, true);
        }

        const error = new Error("Please upload a valid audio file and cover image");
        error.statusCode = 400;
        return cb(error);
    },
})

const router = express.Router();
router.post(
    "/upload",
    authMiddleware.authArtist,
    upload.fields([
        { name: "music", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    validateMusicTitle,
    asyncHandler(musicController.createMusic)
)

router.post("/album", authMiddleware.authArtist, validateAlbumPayload, asyncHandler(musicController.createAlbum))
router.post(
    "/albums/:albumId/upload",
    authMiddleware.authArtist,
    validateAlbumId,
    upload.fields([
        { name: "music", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    validateMusicTitle,
    asyncHandler(musicController.uploadMusicToAlbum)
)

router.get("/artist", authMiddleware.authArtist, asyncHandler(musicController.getMusicsByArtist))

router.post("/albums/:albumId/add", authMiddleware.authArtist, validateAlbumId, validateMusicIds, asyncHandler(musicController.addExistingMusicsToAlbum))
router.put("/albums/:albumId/order", authMiddleware.authArtist, validateAlbumId, validateMusicIds, asyncHandler(musicController.reorderAlbumTracks))

router.get("/", validatePagination, asyncHandler(musicController.getAllMusics))

router.get("/albums", asyncHandler(musicController.getAllAlbums))
router.get("/albums/:albumId", validateAlbumId, asyncHandler(musicController.getAlbumById))

module.exports = router;
