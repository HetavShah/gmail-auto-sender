const express=require('express');
const dotenv=require('dotenv');
const { errorHandler } = require('./middlewares/error-handler');
const { authRouter } = require('./routes/auth-handler');
const passport=require('passport');
require('express-async-errors');
require('./middlewares/config/passport');
dotenv.config();
const cookieSession = require('cookie-session');
const { emailRouter } = require('./routes/send-email');

const app=express();
app.use(cookieSession({
  name: 'google-auth-session',
  keys: ['key1', 'key2'],
}))

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.json({
    message:"Welcome to automatic email sending service. Login with google and that's it",
    auth_url:`http://localhost:${process.env.PORT||3000}/google`
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
