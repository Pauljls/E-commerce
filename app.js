const express = require("express")
const app = express();
const bodyParser = require('body-parser')
require('dotenv/config')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const usersRouter = require('./routers/users')
const productsRouter = require('./routers/products')
const categoriesRouter = require('./routers/categories');
const authJwt = require("./helpers/jwt");
const errorHandler = require('./helpers/error-handler')
const ordersRouter = require('./routers/orders')

//MIDDLEWARE -REVISA TODO LO QUQE VA AL SERVIDOR ANTES DE EJECUTARSE
//ES NECESARIO USAR CORSE PARA PODER TRABAJAR CON SOLICITUDES LEJOS DE
//DE NUESTRO AMBIENTE DE TRABAJO EN LOCALHOST:3000
//COMO LO PODRIA SER EN LCOALHOST:5000 U OTROS
//IMPORTANTE, CORS DEBE ESTAR ANNTES DE TODO
app.use(cors())
//CON ESTA LINEA DE OPCIONES DECIMOS QUE 
//QUEREMOS USAR CORS EN CUALQUIER PETICION HTTP COMO
// GET POST PUT DELETE, ETC
app.options('*', cors);
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt);
app.use(errorHandler)


//ROUTES

const api  = process.env.API_URL ;

//Routers, ademas tambien son middlewares de rutas pero los ponemos aca porque en general son rutas

app.use(`${api}/products`,productsRouter)
app.use(`${api}/users`,usersRouter)
app.use(`${api}/categories`,categoriesRouter)
app.use(`${api}/orders`,ordersRouter)

/*NORMALMENTE LA CONEXION CON LA BASE DE DATOS SE HACE ANTES DE ABRIR EL SERVER */
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log("La conexion a la base de datos esta funcionando")
})
.catch((err)=>{
    console.log(err);
})
//WE SPECIFY 3000 AS A PORT AND THE THE PROCESS THAT WE WANT TO DO
app.listen(3000,()=>{
  
    console.log('el servidorar esta corriendo en http://localhost:3000')
})