const express=require('express');
const router=express.Router();
const passport=require('passport');

router.get("/failed", (req, res) => {
  res.send("Failed")
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


module.exports={
  authRouter:router
}
