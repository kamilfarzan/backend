const passportLocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const initialize = (passport, getUserByEmail, getUserById) => {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password Incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(
    new passportLocalStrategy({ usernameField: "email" }, authenticateUser)
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    let checkUser = getUserById(id);
    if (checkUser) {
      return done(null, checkUser);
    } else {
      return done(null, false);
    }
  });
};

module.exports = initialize;
