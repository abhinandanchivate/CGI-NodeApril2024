const TwitterStrategy = require("passport-twitter").Strategy;

passport.use(
  new TwitterStrategy(
    {
      consumerKey,
      consumerSecret,
      callbackURL: callbackUrl,
    },
    (token, tokenSecret, profile, done) => {
      return done(null, profile);
    }
  )
);
