const Meme = require("../dataModels/Meme.model");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { log } = require("console");

const postMeme = async (req, res, next) => {
  
  const { name, description } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({ error: "Name field is required!" });
  }

  try {
    const newMeme = new Meme({ userId, name, description });
    await newMeme.save();
    res.status(201).json(newMeme);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getMemebyID = async (req, res, next) => {

  const userId = req.user.id
  console.log(userId);

  try {
    const meme = await Meme.find({ userId });
    res.json(meme);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

const getMemeDetails = async (req, res, next) => {

  const memeId = req.params.id

  try {
    const meme = await Meme.find({ _id: memeId });
    res.json(meme);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

const getLatestMemes = async (req, res, next) => {
  try {
    const latestMemes = await Meme.find()
      .sort({ _id: -1 })
      .limit(8);

    res.json({ latestMemes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMeme = async (req, res) => {
  try {
    const userId = req.user.id;

    const memeId = req.params.id;

    const meme = await Meme.findById(memeId);

    if (!meme) {
      return res.status(404).json({ message: 'Meme not found' });
    }

    if (meme.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this meme' });
    }

    await Meme.deleteOne({ _id: memeId });

    res.json({ message: 'Meme deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateMeme = async (req, res) => {

  try {

    const { name, description } = req.body;
    const userId = req.user.id;
    const id = req.params.id;
    console.log(userId);
    console.log(id);

    const meme = await Meme.findById(id);
    if (!meme) {
      return res.status(404).json({ message: 'Meme not found' });
    }
    console.log(meme.userId);
    // Check if the user is authorized to update this meme
    if (meme.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this meme' });
    }

    if (name) {
      meme.name = name;
    }

    if (description) {
      meme.description = description;
    }


    await meme.save();

    res.json({ message: 'Meme information updated successfully' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

};

const postMemeImage = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    const image = req.file.filename

    const memeId = req.params.id
    const meme = await Meme.findById(memeId);
    console.log(meme);
    if (meme.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to upload image for this meme' });
    }


    if (image) {
      meme.images = image
    }

    await meme.save();

    res.json({ message: 'Meme image added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postMultipleMemeImages = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.files) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const newImages = req.files.map((file) => file.filename);

    const memeId = req.params.id
    const meme = await Meme.findById(memeId);
    console.log(meme)
    if (meme.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to upload images for this meme' });
    }


    if (newImages) {
      const existingImages = meme.images || [];

      // Combine existing images with new images
      const updatedImages = existingImages.concat(newImages);

    
      meme.images = updatedImages;
    }
    await meme.save();

    res.json({ message: 'Multiple images added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMemeImages = async (req, res) => {
  try {
    const memeId = req.params.id
    const meme = await Meme.findById(memeId);
    console.log(meme)
    const images = meme.images

    res.json({ images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMemeImages = async (req, res) => {
  const { memeId, imageId } = req.params;
  const userId = req.user.id;

  try {
    const meme = await Meme.findById(memeId);

    if (meme.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update images for this meme' });
    }


    if (!meme) {
      return res.status(404).json({ message: 'Meme not found' });
    }

    
    const newImage = req.file.filename;

    if (!meme.images) {
      
      meme.images = [];
    }

    const index = meme.images.indexOf(imageId);

    if (index !== -1) {
      meme.images[index] = newImage;

      await meme.save();
      res.json({ message: 'Image updated successfully', meme });
    } else {
      res.status(404).json({ message: 'Image not found in meme' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMemeImage = async (req, res) => {
  const { memeId, imageId } = req.params;
  const userId = req.user.id;

  try {
    const meme = await Meme.findById(memeId);
    if (meme.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update images for this meme' });
    }


    if (!meme || !meme.images.includes(imageId)) {
      return res.status(404).json({ message: 'Meme or image not found' });
    }

    meme.images = meme.images.filter(image => image !== imageId);
    await meme.save();

    res.json({ message: 'Meme image deleted successfully', meme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postMemeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    const video = req.file.filename

    const memeId = req.params.id
    const meme = await Meme.findById(memeId);
    console.log(meme);
    if (meme.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to post videos for this meme' });
    }


    if (video) {
      meme.videos = video
    }

    await meme.save();

    res.json({ message: 'Meme video added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postMultipleMemeVideos = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    if (!req.files) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const newVideos = req.files.map((file) => file.filename);

    const memeId = req.params.id
    const meme = await Meme.findById(memeId);

    console.log(meme.userId);

    if (meme.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to upload videos for this meme' });
    }


    if (newVideos) {
      const existingVideos = meme.videos || [];

      const updatedVideos = existingVideos.concat(newVideos);

      meme.videos = updatedVideos;
    }
    await meme.save();

    res.json({ message: 'Multiple videos added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMemeVideos = async (req, res) => {
  try {
    const memeId = req.params.id
    const meme = await Meme.findById(memeId);
    console.log(meme)
    const videos = meme.videos

    res.json({ videos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMemeVideo = async (req, res) => {
  const { memeId, videoId } = req.params;
  const userId = req.user.id;

  try {
    const meme = await Meme.findById(memeId);

    if (meme.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update images for this meme' });
    }


    if (!meme) {
      return res.status(404).json({ message: 'Meme not found' });
    }

    
    const newVideo = req.file.filename;

    if (!meme.videos) {
      
      meme.videos = [];
    }

    const index = meme.videos.indexOf(videoId);

    if (index !== -1) {
      meme.videos[index] = newVideo;

      await meme.save();
      res.json({ message: 'Video added successfully', meme });
    } else {
      res.status(404).json({ message: 'Video not found in meme' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMemeVideo = async (req, res) => {
  const { memeId, videoId } = req.params;
  const userId = req.user.id;

  try {
    const meme = await Meme.findById(memeId);
    if (meme.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete video for this meme' });
    }


    if (!meme || !meme.videos.includes(videoId)) {
      return res.status(404).json({ message: 'Meme or video not found' });
    }

    meme.videos = meme.videos.filter(video => video !== videoId);
    await meme.save();

    res.json({ message: 'Meme video deleted successfully', meme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const likeMeme = async (req, res) => {
  const userId = req.user.id;
  const name = req.user.name;
  const memeId = req.params.id;

  try {
    const meme = await Meme.findById(memeId);

    if (!meme) {
      return res.status(404).json({ message: 'Meme not found' });
    }

    if (meme.likedBy.includes(userId)) {
      return res.status(400).json({ message: 'You have already liked this meme' });
    }
    meme.likedBy.push({
      user: userId,
      name,
    });

    meme.likes += 1;

    await meme.save();
    res.json({ message: 'Meme liked successfully', meme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unlikeMeme = async (req, res) => {
  const userId = req.user.id;
  const memeId = req.params.id;

  try {
    const meme = await Meme.findById(memeId);

    if (!meme) {
      return res.status(404).json({ message: 'Meme not found' });
    }

    // Check if the user has liked the meme
    const likeIndex = meme.likedBy.findIndex(like => like.user.equals(userId));

    if (likeIndex === -1) {
      return res.status(400).json({ message: 'You have not liked this meme' });
    }

    meme.likedBy.splice(likeIndex, 1);

    // Decrease the like count
    meme.likes -= 1;

    await meme.save();
    res.json({ message: 'Meme unliked successfully', meme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const postComment = async (req, res) => {
  const userId = req.user.id;
  const memeId = req.params.id;
  const name = req.user.name;
  const { content } = req.body;

  try {
    const meme = await Meme.findById(memeId);

    if (!meme) {
      return res.status(404).json({ message: 'Meme not found' });
    }

    // Check if the user is the owner of the meme
    if (meme.userId.equals(userId)) {
      return res.status(403).json({ message: 'You cannot comment on your own post' });
    }


    meme.comments.push({
      user_id: userId,
      content,
      name
    });

    meme.commentCount += 1;

    await meme.save();
    res.json({ message: 'Comment added successfully', meme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  const userId = req.user.id;
  const memeId = req.params.memeId;
  const commentId = req.params.commentId;

  try {
    const meme = await Meme.findById(memeId);

    if (!meme) {
      return res.status(404).json({ message: 'Meme not found' });
    }

  
    const commentIndex = meme.comments.findIndex(comment => comment._id.equals(commentId));

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const comment = meme.comments[commentIndex];

    // Check if the user deleting the comment is the same user who made the comment
    if (!comment.user_id.equals(userId)) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }

    
    meme.comments.splice(commentIndex, 1);

    // Decrease the comment count
    meme.commentCount -= 1;

    await meme.save();

    res.json({ message: 'Comment deleted successfully', meme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateComment = async (req, res) => {
  const userId = req.user.id;
  const memeId = req.params.memeId;
  const commentId = req.params.commentId;
  const { newContent } = req.body;

  try {
    const meme = await Meme.findById(memeId);

    if (!meme) {
      return res.status(404).json({ message: 'Meme not found' });
    }

    // Find the index of the comment
    const commentIndex = meme.comments.findIndex(comment => comment._id.equals(commentId));

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const comment = meme.comments[commentIndex];

    // Check if the user updating the comment is the same user who made the comment
    if (!comment.user_id.equals(userId)) {
      return res.status(403).json({ message: 'You are not authorized to update this comment' });
    }

    // Update the content of the comment
    meme.comments[commentIndex].content = newContent;

    await meme.save();

    res.json({ message: 'Comment updated successfully', meme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getLikes = async (req, res) => {
  const memeId = req.params.id;

  try {
    const meme = await Meme.findById(memeId);

    if (!meme) {
      return res.status(404).json({ message: 'Meme not found' });
    }

    const likedByNames = meme.likedBy.map(like => like.name);

    res.json({ likes: meme.likes, likedBy: likedByNames });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getComments = async (req, res) => {
  const memeId = req.params.id;

  try {
    const meme = await Meme.findById(memeId);

    if (!meme) {
      return res.status(404).json({ message: 'Meme not found' });
    }

    const commentsInfo = meme.comments.map(comment => ({
      name: comment.name,
      content: comment.content,
      timestamp: comment.timestamp,
    }));

    res.json({ comments: commentsInfo, commentCount: meme.commentCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMultipleMemeImages = async (req, res) => {

  const { memeId } = req.params;
  const userId = req.user.id;

  try {
    const meme = await Meme.findById(memeId);

    if (!meme || meme.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update images for this meme' });
    }

    if (!meme.images) {
      meme.images = [];
    }

    
    const newImages = req.files.map(file => file.filename);

    
    meme.images = newImages;
    await meme.save();
    res.json({ message: 'Images updated successfully', meme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMultipleMemeImages = async (req, res) => {
  const { memeId } = req.params;
  const userId = req.user.id;

  try {
    const meme = await Meme.findById(memeId);
    console.log(meme);
    console.log(req.body);

    if (!meme || meme.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete images for this meme' });
    }

    if (!meme.images || !req.body.imageIds || !Array.isArray(req.body.imageIds)) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const deletedImages = [];
    meme.images = meme.images.filter(image => {
      if (req.body.imageIds.includes(image)) {
        deletedImages.push(image);
        return false;
      }
      return true;
    });

    await meme.save();

    res.json({ message: 'Meme images deleted successfully', deletedImages, meme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMultipleMemeVideos = async (req, res) => {
  const { memeId } = req.params;
  const userId = req.user.id;

  try {
    const meme = await Meme.findById(memeId);

    if (!meme || meme.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete videos for this meme' });
    }

    if (!meme.videos || !req.body.videoIds || !Array.isArray(req.body.videoIds)) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const deletedVideos = [];
    meme.videos = meme.videos.filter(video => {
      if (req.body.videoIds.includes(video)) {
        deletedVideos.push(video);
        return false;
      }
      return true;
    });

    await meme.save();

    res.json({ message: 'Meme videos deleted successfully', deletedVideos, meme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const updateMultipleMemeVideos = async (req, res) => {
  const { memeId } = req.params;
  const userId = req.user.id;

  try {
    const meme = await Meme.findById(memeId);

    if (!meme || meme.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update images for this meme' });
    }

    if (!meme.videos) {
      meme.videos = [];
    }


    const newVideos = req.files.map(file => file.filename);

    meme.videos = newVideos;

    await meme.save();
    res.json({ message: 'Videos updated successfully', meme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = {
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
};