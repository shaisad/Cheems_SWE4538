const User = require("../dataModels/User.model");
const ResetToken = require("../dataModels/ResetToken.model");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const nodemailer = require('nodemailer');
var crypto = require('crypto');

const getLogin = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "login.html");
  res.sendFile(filePath);
};



const getAuthLogin = (req, res, next) => {
  passport.authenticate("google", {
    successRedirect: '/welcome',
    failureRedirect: '/error',
    failureFlash: true,
  })(req, res, next);
};



const postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/welcome",
    failureRedirect: "/error",
    failureFlash: true,
  })(req, res, next);
};


const showerror = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "error.html");
  res.status(400).sendFile(filePath);
};



const getRegister = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "register.html");
  res.sendFile(filePath);
};

const postRegister = async (req, res, next) => {

  const { email, password } = req.body;
  const name = req.body.name

  console.log(name)
  console.log(email)
  console.log(password)

  const errors = []
  // Email validation
  const emailValidated = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValidated.test(email)) {
    errors.push("Invalid email address!");
  }

  // Password validation 
  // Must include at least 6 characters, one uppercase letter, one lowercase letter, and one number
  const passwordValidated = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
  if (!passwordValidated.test(password)) {
    errors.push("Invalid password! It must be at least 6 characters and include at least one uppercase letter, one lowercase letter, and one number.");
  }

  if (!name || !email || !password) {
    errors.push("All fields are required!");
  }

  if (errors.length > 0) {
    res.status(400).json({ error: errors });
  } else {
    //Create New User
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push("User already exists with this email!");
        res.status(400).json({ error: errors });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            errors.push(err);
            res.status(400).json({ error: errors });
          } else {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) {
                errors.push(err);
                res.status(400).json({ error: errors });
              } else {
                const newUser = new User({
                  name,
                  email,
                  password: hash,
                });
                newUser
                  .save()
                  .then(() => {
                    res.redirect("/login");
                  })
                  .catch(() => {
                    errors.push("Please try again");
                    res.status(400).json({ error: errors });
                  });
              }
            });
          }
        });
      }
    });
  }
};

const getLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.redirect('/login'); // Redirect to the home page 
  });
};


var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },

});

const getForgotPassword = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "forgotPassword.html");
  res.sendFile(filePath);
};

const forgotPassword = async (req, res) => {
  // console.log(req.body)
  const { email } = req.body;
  try {
    const userfind = await User.findOne({ email: email });
    const otp = crypto.randomBytes(2).toString("hex");
    const resettoken = new ResetToken({ userId: userfind._id, token: otp });
    const setusertoken = await resettoken.save();

    console.log("here")

    if (setusertoken) {
      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Password Reset",
        html: `<h2>Please use this OTP to reset your password</h2>
                <h1>${otp}</h1>`
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          res.send({ message: "Could not send email" })
        } else {
          console.log("Email sent", info.response);
          res.redirect("/resetPassword")
        }
      })

    }

  } catch (error) {
    res.send({ message: "Invalid user" })
  }
};

const getResetPassword = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "resetPassword.html");
  res.sendFile(filePath);
};

const resetPassword = async (req, res) => {

  const { otp, password } = req.body;

  try {
    const validtoken = await ResetToken.findOne({ token: otp });

    const validuser = await User.findOne({ _id: validtoken.userId })

    if (validuser && validtoken) {
      const newpassword = await bcrypt.hash(password, 10);
      await User.updateOne({ _id: validuser._id }, { $set: { password: newpassword } })
      req.login(validuser, (err) => {
        if (err) {
          console.error("Re-authentication Error:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        res.send({ message: "Password has been reset" })
      });
    } else {
      res.send({ message: "User does not exist" })
    }
  } catch (error) {
    res.send({ error })
  }
}


module.exports = {
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
  getAuthLogin
};
