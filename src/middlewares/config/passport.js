const passport=require('passport');
const dotenv=require('dotenv');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

dotenv.config();

passport.serializeUser(function(user, done) {
  // console.log(user);
    done(null, user._json);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

passport.use(new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/google/callback",
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
      profile._json.accessToken = accessToken;
            return done(null, profile);
    }
));


