const express = require("express");
const {uploadMemeImage, 
    uploadAudioFile, 
    uploadVideoFile, 
    uploadFile} = require("../middlewares/media.middleware")
const router = express.Router();
const {
  postMeme,
  getMemebyID,
  getMemeDetails,
  getLatestMemes,
  deleteMeme,
  updateMeme,
  postMemeImage,
  postMultipleMemeImages,
  getMemeImages,
  updateMemeImages,
  deleteMemeImage,
  postMemeVideo,
  postMultipleMemeVideos,
  getMemeVideos,
  updateMemeVideo,
  deleteMemeVideo,
  likeMeme,
  unlikeMeme,
  postComment,
  deleteComment,
  getLikes,
  getComments,
  updateMultipleMemeImages,
  deleteMultipleMemeImages,
  deleteMultipleMemeVideos,
  updateMultipleMemeVideos,
  updateComment
} = require("../controllers/meme.controllers");


router.post("/postMeme", postMeme);
router.get("/getMeme", getMemebyID);
router.get("/getMemeDetails/:id", getMemeDetails);
router.get("/getLatestMemes", getLatestMemes);
router.delete("/deleteMeme/:id", deleteMeme);
router.patch("/updateMeme/:id", updateMeme);
router.post('/uploadMemeImage/:id', uploadMemeImage.single('images'), postMemeImage);
router.post('/uploadMultipleImages/:id', uploadMemeImage.array('images', 5), postMultipleMemeImages);
router.get('/getMemeImages/:id', getMemeImages);
router.put("/updateMemeImages/:memeId/:imageId",uploadMemeImage.single('images'), updateMemeImages);
router.delete('/deleteMemeImage/:memeId/:imageId', deleteMemeImage);
router.post('/uploadMemeVideo/:id', uploadVideoFile.single('videos'), postMemeVideo);
router.post('/uploadMultipleMemeVideo/:id', uploadVideoFile.array('videos', 5), postMultipleMemeVideos);
router.get('/getMemeVideos/:id', getMemeVideos);
router.delete('/deleteMemeVideo/:memeId/:videoId', deleteMemeVideo);
router.put("/updateMemeVideo/:memeId/:videoId",uploadVideoFile.single('videos'), updateMemeVideo);
router.patch('/likeMeme/:id', likeMeme);
router.patch('/unlikeMeme/:id', unlikeMeme);
router.post('/postComment/:id', postComment);
router.delete('/deleteComment/:memeId/:commentId', deleteComment);
router.patch('/updateComment/:memeId/:commentId', updateComment);
router.get('/getLikes/:id', getLikes);
router.get('/getComments/:id', getComments);
router.patch("/updateMultipleMemeImages/:memeId",uploadMemeImage.array('images', 5), updateMultipleMemeImages);
router.delete('/deleteMultipleMemeImages/:memeId', deleteMultipleMemeImages);
router.delete('/deleteMultipleMemeVideos/:memeId', deleteMultipleMemeVideos);
router.patch("/updateMultipleMemeVideos/:memeId",uploadVideoFile.array('videos', 5), updateMultipleMemeVideos);

module.exports = router;