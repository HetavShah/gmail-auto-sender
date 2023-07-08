const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
        res.redirect('/google');
  }
}

module.exports= {
  isLoggedIn
}