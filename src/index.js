const {app}=require('./app');
const { CustomError } = require('./middlewares/custom-error');
const mongoose=require('mongoose');

const  start = async() => {
  if(!process.env.MONGO_URI)
  {
    throw new Error('MONGO_URI environment variable is not set');
  }
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB!');

  }catch(err)
  {
    console.log(err);
  }
  app.listen(process.env.PORT||3000, () => {
    console.log('Application listening');
    });
};

start();
