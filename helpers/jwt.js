const expressJwt = require('express-jwt');


// Middleware de autenticación que verifica si el token es válido.
function authJwt(req, res, next) {
    const secret = process.env.secret;
    const api = process.env.API_URL
    expressJwt({
        secret,
        algorithms: ['HS256'],
        //JWT TIENE UN METODO QUE NOS PERMITIRA REVISAR LA INFOMRACION DEL TOKEN
        //EN ESTE CASO REVISAREMOS QUE SEA UN ADMIN APRA QUE PEUDA MODIFICAR LA INFOMARCION 
        //DE LA BD
        isRevoked : isRevoked
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
            {url: /\/public\/uploads(.*)/, methods: ['GET','OPTIONS']},
            {url: /\/api\/v1\/products(.*)/, methods: ['GET','OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET','OPTIONS']}, 
            '/api/v1/users/login',
            '/api/v1/users/register'
        ]
    })
    //se require de req res para que peuda interactuar con las solicitudes http
    (req, res, next);
}
//CON PAYLOAD NOSOTROS REVISAMOS LA INFORMACION DENTRO DEL TOKEN
async function isRevoked(req,payload,done){
    if(!payload.isAdmin){
    //CON ESTA CONFIGURACION EN DONE RECHAZAMOS EL TOKEN
        done(null,true)
    }

    done()
}

module.exports = authJwt;

