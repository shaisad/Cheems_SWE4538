const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require("../dataModels/User.model");

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
       // Match User
       try{
        const user = await User.findOne({ email: email });
        console.log(user)
         if (!user) {
           return done(null, false, {
             message: "This email is not registered!",
           });
         } else if (user.googleId) {
          console.log('OAuth user detected');
          return done(null, user);
        } else {
           // Match Password for non-OAuth users
           bcrypt.compare(password, user.password, (err, isMatch) => {
             if (err) throw err;
             if (isMatch) {
               return done(null, user);
             } else {
               return done(null, false, { message: "Password Incorrect!" });
             }
           });
         }
       }
       catch(err) {
         console.log(err);
         return done(err);
       }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser)) 
  passport.serializeUser((user, done) =>{
    done(null, user.id)}) //specify what user data should be stored in the session after a user logs in
  // passport.deserializeUser((id, done) => {  // This function retrieves the user data based on the stored user identifier (e.g., user ID).
  //   return done(null, id)
  // })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
    console.log(user)
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}

module.exports = initialize