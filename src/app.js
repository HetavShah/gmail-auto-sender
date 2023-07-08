const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const { errorHandler } = require('./middlewares/error-handler');
const { authRouter } = require('./middlewares/auth-handler');
const passport=require('passport');
require('./middlewares/config/passport');
dotenv.config();
const cookieSession = require('cookie-session');
const { emailRouter } = require('./routes/send-email');


const port=process.env.PORT ||3000;
let exp=new Date();
exp.setHours(exp.getHours + 1);
const app=express();
app.use(cookieSession({
  name: 'google-auth-session',
  keys: ['key1', 'key2'],
  expires: exp
}))

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.json({
    message:"Welcome to automatic email sending service. Login with google and that's it",
    auth_url:"http://localhost:5000/google"
  })
})

app.use(authRouter);
app.use(emailRouter);

app.all('*',(req,res)=>{
  res.status(404).json({
    message:"Page Not Found"
  });
});

app.use(errorHandler);

module.exports={
  app
}
