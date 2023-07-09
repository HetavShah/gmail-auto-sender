const express = require('express');
const dotenv = require('dotenv');
const { errorHandler } = require('./middlewares/error-handler');
const { authRouter } = require('./routes/auth-handler');
const passport = require('passport');
require('express-async-errors');
require('./middlewares/config/passport');
dotenv.config();
const cookieSession = require('cookie-session');
const { emailRouter } = require('./routes/send-email');

const app = express();

// Configure cookie session middleware
app.use(
  cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2'],
  })
);

// Initialize Passport.js middleware
app.use(passport.initialize());
app.use(passport.session());

// Root route handler
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to automatic email sending service. Login with Google and that's it",
    auth_url: `http://localhost:${process.env.PORT || 3000}/google`,
  });
});

// Use the authentication router
app.use(authRouter);

// Use the email router
app.use(emailRouter);

// 404 route handler
app.all('*', (req, res) => {
  res.status(404).json({
    message: 'Page Not Found',
  });
});

// Error handler middleware
app.use(errorHandler);

// Export the app
exports.app = app;
