const express = require("express");
const passport = require("passport");
const OAuth = require("oauth").OAuth;

const app = express();
app.use(passport.initialize());

// Configure OAuth
const consumerKey = "YOUR_CONSUMER_KEY";
const consumerSecret = "YOUR_CONSUMER_SECRET";
const callbackUrl = "http://localhost:3000/auth/callback";

const oa = new OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  consumerKey,
  consumerSecret,
  "1.0A",
  callbackUrl,
  "HMAC-SHA1"
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Routes
app.get("/auth/twitter", passport.authenticate("twitter"));

app.get(
  "/auth/callback",
  passport.authenticate("twitter", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
