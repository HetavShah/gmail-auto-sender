const express = require('express');
const router = express.Router();
const passport = require('passport');

// Route for handling failed authentication
router.get('/failed', (req, res) => {
  res.send('Authentication failed');
});

// Route for initiating Google OAuth authentication
router.get('/google', passport.authenticate('google', {
  scope: ['email', 'profile', 'https://www.googleapis.com/auth/gmail.modify'], // Specify the requested OAuth scopes
}));

// Route for handling the Google OAuth callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/failed', // Redirect to '/failed' if authentication fails
  successRedirect: '/email', // Redirect to '/email' if authentication succeeds
}));



exports.authRouter=router;
