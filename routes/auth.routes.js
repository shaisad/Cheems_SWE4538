const express = require("express");
const passport = require("passport");
const router = express.Router();
const path = require("path");



const {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
  getLogout,
  getForgotPassword,
  getResetPassword,
  forgotPassword,
  resetPassword,
  showerror,
  getAuthLogin,

} = require("../controllers/auth.controllers");

router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/register", getRegister);
router.post("/register", postRegister);


router.get("/error", showerror);

router.get('/auth/google', getAuthLogin);



router.get("/logout", getLogout);

router.get("/forgotpassword", getForgotPassword);
router.post("/sendpasswordlink", forgotPassword);
router.get("/resetpassword", getResetPassword);
router.post("/resetpassword", resetPassword);


module.exports = router;