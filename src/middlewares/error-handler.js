const {CustomError} = require("./custom-error")

const errorHandler=(err,req,res,next)=>{

  if(err instanceof CustomError)
  {
    return res.status(err.statusCode).json({
      errors:err.formattedErrorMessage()
    });
  }
  console.log(err);
  return res.status(500).send({
    errors:[
      {
        message:"Something went wrong"
      }
    ]
  });

}

module.exports={errorHandler};