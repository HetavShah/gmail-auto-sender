
// Middleware which handles the error
const errorHandler=(err,req,res,next)=>{

  console.log(err);
   res.end("Something went wrong");

}

exports.errorHandler=errorHandler;