// async handler used to handle all requesthandlers
// this helps in easy implementaion of requesthandlers
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(
            requestHandler(req, res, next)
        ).catch((err) => {
            // passes error to global eror handling middleware
            next(err);
        })
    }
}

export { asyncHandler };