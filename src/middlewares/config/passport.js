const passport = require('passport');
const dotenv = require('dotenv');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

dotenv.config();

// Serialize user object to store in session
passport.serializeUser(function(user, done) {
  done(null, user._json); // Store the JSON representation of the user object
});

// Deserialize user object from session
passport.deserializeUser(function(user, done) {
  done(null, user); // Retrieve the user object from the stored JSON representation
});

// Configure Google OAuth 2.0 strategy for Passport.js
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Google client ID obtained from the environment
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret obtained from the environment
    callbackURL: 'http://localhost:5000/google/callback', // Callback URL for Google OAuth
    passReqToCallback: true, // Allow passing the request object to the callback function
  },
  function(request, accessToken, refreshToken, profile, done) {
    profile._json.accessToken = accessToken; // Attach the access token to the user profile object
    return done(null, profile); // Pass the profile object to the callback function
  }
));


