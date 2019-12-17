module.exports = {
    secret: 'sequelizExpress',
    conflict: {
        "message": "KO",
        "details": "Entity already exists"
    },
    internal: {
        "message": "KO",
        "details": "Internal Server Error"
    },
    badRequest: {
        "message": "KO",
        "details": "Bad Request"
    },
    unauthorized: {
        "message": "KO",
        "details": "Unauthorized"
    },
    forbidden: {
        "message": "KO",
        "details": "You are not allowed to access this resource"
    }
}