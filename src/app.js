const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const { errorHandler } = require('./middlewares/error-handler');
dotenv.config();

const port=process.env.PORT ||3000;

const app=express();

app.get('/', (req, res) => {
  res.json({
    message:"Hi there"
  })
})

app.all('*',(req,res)=>{
  res.status(404).json({
    message:"Page Not Found"
  });
});

app.use(errorHandler);
