const mongoose = require("mongoose");

const MemeSchema = new mongoose.Schema({
  // userId:
  // {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  // },
  name: {
    type: String,
    required: true,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' },
  description: {
    type: String,
  },
  icon: String,
  images: {
    type: [String],
    default: [],
  },
  videos: {
    type: [String],
    default: [],
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
      },
      name: String,  
    },
  ],

  commentCount: {
    type: Number,
    default: 0,
  },

  comments: {
    type: [{
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      name: String,
      content: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }],
    default: [],
  },
}, {
  timestamps: true,
});

const Meme = mongoose.model("Meme", MemeSchema);
module.exports = Meme;
