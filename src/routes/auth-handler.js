const express=require('express');
const router=express.Router();
const passport=require('passport');

router.get("/failed", (req, res) => {
  res.send("Authentication failed")
})

router.get('/google',
  passport.authenticate('google', {
          scope:
              ['email', 'profile','https://www.googleapis.com/auth/gmail.modify']
      }
  ));

router.get('/google/callback',
  passport.authenticate('google', {
      failureRedirect: '/failed',
      successRedirect: '/email'
  }),
);


exports.authRouter=router;
