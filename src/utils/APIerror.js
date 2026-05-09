// class of APIerror that extends error class 
// helps to send custom errors
class APIerror extends Error {
    constructor(
        statusCode,message="Something went wrong",
        errors=[],
        stack=""
    ){
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success= false;
        this.errors=errors;

        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}

export { APIerror };