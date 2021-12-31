// DECLARATIONS

require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
const users = [];
const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email == email),
  (id) => users.find((user) => user.id == id)
);

//CSS IMPORT

app.use(express.static(__dirname + "/public"));

// SETUPS

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// ROUTES

app.get("/", passAuth, (req, res) => {
  res.render(
    "index.ejs",
    req.user?.name ? { name: req.user.name } : { name: false }
  );
});
// { name: req.user.name }
app.get("/forum", passAuth, (req, res) => {
  res.render(
    "forum.ejs",
    req.user?.name ? { name: req.user.name } : { name: false }
  );
});

app.get("/resources", passAuth, (req, res) => {
  res.render(
    "resources.ejs",
    req.user?.name ? { name: req.user.name } : { name: false }
  );
});

app.get("/about", passAuth, (req, res) => {
  res.render(
    "about.ejs",
    req.user?.name ? { name: req.user.name } : { name: false }
  );
});

app.get("/contact", passAuth, (req, res) => {
  res.render(
    "contact.ejs",
    req.user?.name ? { name: req.user.name } : { name: false }
  );
});

// -- LOGIN

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// -- REGISTER

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

// -- LOGOUT

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

// -- ERROR PAGE

app.use((req, res) => {
  return res.redirect("/");
});

// AUTHENTICATING FUNCTIONS

function passAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  next();
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

// PORT SETUP

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Running At", PORT));
