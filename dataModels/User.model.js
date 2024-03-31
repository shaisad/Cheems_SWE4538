const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  // profile_image: {
  //   type: String,
  //   default:'',
  // },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null or undefined values, ensuring uniqueness for non-null values
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;