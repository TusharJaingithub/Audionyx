const express = require("express")
const musicController = require("../controllers/music.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const multer = require("multer")

const upload= multer({
    storage:multer.memoryStorage(),
})

const router = express.Router();
router.post(
    "/upload",
    authMiddleware.authArtist,
    upload.fields([
        { name: "music", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    musicController.createMusic
)

router.post("/album",authMiddleware.authArtist,musicController.createAlbum)
router.post(
    "/albums/:albumId/upload",
    authMiddleware.authArtist,
    upload.fields([
        { name: "music", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    musicController.uploadMusicToAlbum
)

router.get("/artist", authMiddleware.authArtist, musicController.getMusicsByArtist)

router.post("/albums/:albumId/add", authMiddleware.authArtist, musicController.addExistingMusicsToAlbum)
router.put("/albums/:albumId/order", authMiddleware.authArtist, musicController.reorderAlbumTracks)

router.get("/",musicController.getAllMusics)

router.get("/albums",musicController.getAllAlbums)
router.get("/albums/:albumId",musicController.getAlbumById)

module.exports = router;
