// This is a global error handling middleware function
export const errorHandler = (err, req, res, next) => {
    // By default this assumes a internal server error
    // based on the statuscode and message that we throw 
    // it get's message and status and flag is false
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
    });
}