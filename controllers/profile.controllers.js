const User = require("../dataModels/User.model");
const Meme = require("../dataModels/Meme.model");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const nodemailer = require('nodemailer');
var crypto = require('crypto');

const getProfileInfo = async (req, res) => {
  try {
    const userId = req.user.id
    console.log(userId)
    const user = await User.find({ _id: userId }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfileInfos = async (req, res) => {
  try {
    // Retrieve user profiles from the database
    const user = await User.find().select("-password");

    // Exclude sensitive information (e.g., password) from each profile
    const profiles = user.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email
    }));

    res.json(profiles);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

  
    const deletedProfile = await User.findByIdAndDelete(userId);

    if (!deletedProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    console.log(newPassword)

    const userId = req.user.id
    const user = await User.findById(userId);
    console.log(user)

    
    if (newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }


    if (name) {
      user.name = name
    }

    await user.save();

    res.json({ message: 'User information updated successfully' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const memes = await Meme.find({ id: userId });

    
    const userProfile = {
      user: user.toObject(),
      memes,
    };

    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {

  updateProfile,
  getUserProfile,
  deleteProfile,
  getProfileInfos
};
