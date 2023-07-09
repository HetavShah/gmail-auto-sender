const { app } = require('./app');
const mongoose = require('mongoose');
const port=process.env.PORT || 3000;
const start = async () => {
  // Check if the MONGO_URI environment variable is set
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  try {
    // Connect to MongoDB using the MONGO_URI
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.log(err);
  }

  // Start the application server
  app.listen(port, () => {
    console.log(`Application listening on port: ${port}`);
  });
};

// Start the application
start();
