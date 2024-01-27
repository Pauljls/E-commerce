const express = require("express")
const app = express();
const bodyParser = require('body-parser')
require('dotenv/config')
const morgan = require('morgan')
const mongoose = require('mongoose')





//MIDDLEWARE

app.use(bodyParser.json());
app.use(morgan('tiny'))

const usersRouter = require('./routers/users')
const productsRouter = require('./routers/products')
const categoriesRouter = require('./routers/categories')
const ordersRouter = require('./models/order')

//ROUTES

const api  = process.env.API_URL ;

//Routers, ademas tambien son middlewares de rutas pero los ponemos aca porque en general son rutas
app.get('/',(req,res)=>{
    res.send('Hola mundo')
})
app.use(`${api}/products`,productsRouter)
app.use(`${api}/users`,productsRouter)
app.use(`${api}/orders`,productsRouter)
app.use(`${api}/categories`,productsRouter)

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