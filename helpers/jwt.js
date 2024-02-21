const expressJwt = require('express-jwt');

// Middleware de autenticación que verifica si el token es válido.
function authJwt(req, res, next) {
    const secret = process.env.secret;
    expressJwt({
        secret,
        algorithms: ['HS256']
        //se require de req res para que peuda interactuar con las solicitudes http
    })(req, res, next);
}

module.exports = authJwt;

