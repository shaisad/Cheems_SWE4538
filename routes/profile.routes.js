const express = require("express");
const passport = require('passport')
const router = express.Router();

const {
    updateProfile,
    getUserProfile,
    deleteProfile,
    getProfileInfos
    } = require("../controllers/profile.controllers");


router.patch("/updateprofile",  updateProfile);
router.get("/getuserprofile", getUserProfile);
router.get("/getprofiles", getProfileInfos);
router.delete("/deleteprofile", deleteProfile);


module.exports = router;