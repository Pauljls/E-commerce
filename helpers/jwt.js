const expressJwt = require('express-jwt');


// Middleware de autenticación que verifica si el token es válido.
function authJwt(req, res, next) {
    const secret = process.env.secret;
    const api = process.env.API_URL
    expressJwt({
        secret,
        algorithms: ['HS256']
        //se require de req res para que peuda interactuar con las solicitudes http
    }).unless(
        //CON UNLESS ESPECIFICAMOS LAS RUTAS EN LAS QUE NO NECESITAMOS SER AUTENTICADOS
        {
        path : [
            //SI QUEREMOS ESPECIFICAR EL METODO EXACTO SERA NECESARIO
            //CREAR UN OBJETO PARA AGREGAR LA DIRECCION Y EL METODO,
            //ESTOS DEBEN SER DECLARADOS CON MAYUSCULAS
            //1.{url: `${process.env.API_URL}/products`,methods: ['GET','OPTIONS'] },
            //2.USAREMOS EXPERSIONES REGUALRES DEBIDO A QUE EL METODO ANTERIOR
            //SOLO NOS DARA COBERETURA PARA PRODUCTS Y NOSOTROS USAREMOS MAS FUNCIONES
            //EN PRODUCTS COMO /PORDUCTS/COUNT, /ID ,/FEATURED, ETC
            {url: /\/api\/v1\/products(.*)/, methods: ['GET','OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET','OPTIONS']}, 
            '/api/v1/users/login',
            '/api/v1/users/register'
        ]
    })(req, res, next);
}


module.exports = authJwt;

