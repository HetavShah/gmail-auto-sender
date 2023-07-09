const {CustomError} = require("./custom-error")

const errorHandler=(err,req,res,next)=>{

  if(err instanceof CustomError)
  {
    res.end(err.formattedErrorMessage()); 
  }
  console.log(err);
   res.end("Something went wrong");

}

exports.errorHandler=errorHandler;