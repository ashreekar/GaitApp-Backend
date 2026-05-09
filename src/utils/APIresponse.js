//custom class for api repsonse
class APIresponse {
    // api repsonse structed object this way
    constructor(statusCode, data, message = "Sucess") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export { APIresponse };