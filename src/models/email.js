const mongoose=require('mongoose');

const emailSchema=new mongoose.Schema({
  threadId:"String"
});


const Email=new mongoose.model("Email",emailSchema);

module.exports={
  Email
}