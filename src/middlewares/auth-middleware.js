
// Middleware which checks for authentication
const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
        res.redirect('/google');
  }
}

exports.isLoggedIn = isLoggedIn;