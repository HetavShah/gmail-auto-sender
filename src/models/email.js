const mongoose=require('mongoose');

const emailSchema=new mongoose.Schema({
  threadId:{
    type:String,
    required:true,
  },
  status:{
    type:Boolean,
    required:true,
  }
});


const Email=new mongoose.model("Email",emailSchema);

exports.Email=Email;