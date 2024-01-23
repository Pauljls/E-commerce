const express = require("express")
const app = express();
const bodyParser = require('body-parser')
/*ESTO NOS PERMITIRA USAR CONSTANTES ESPECIFICAS DE ARCHIVO .ENV */
require('dotenv/config')
/*CON ESTA LIBRERIA PODEMOS REGISTRAR LAS SOLICITUDES HTTPS */
const morgan = require('morgan')
/*CONEXION CON LA ABSE DE DATOS */
const mongoose = require('mongoose')
/*UNA COLECCION EN MONGODB ES LO MISMO QUE UN MODELO EN MONGOOSE */

/*AQUI LLAMAMOS A LA CONSTANTE*/
const api=process.env.API_URL;

/*REFACTORIZACION DE LAS DIRECCIONES DE NUESTRO SITIO WEB */
//const Product = require('./models/product');
const productsRouter = require("./routers/products");

/*UN MIDDLEWARE ES UNA FUNCION QUE TIENE EL CONTROL DEL PEDIDO Y RESPEUSTA DE CUALQUIER API */
/*EN ESTE CASO ESTE MIDDLE WARE NOS AYDUARA A ANALI<AR MEJOR LA RESPUESTA DEL BODY EN EL FRONTEND */
/*CUANDNO EL FRONT END ENVIE UN OBJETO JSON NECESITAMOS QUE EL BACKEND ENTIENDA ENTIENDA ESTE JSON  */

app.use(bodyParser.json());
app.use(morgan('tiny'))
/*ROUTER TAMBEIN PUEDE SER USADO COMO MIDDLEWARE POR LO ANTERIORMENTE MENCIONADO 
EN ESTE CASO SUAREMOS LA RUTA PRNCIPAL REGISTRADA AL MOMENTO*/

//Routers
app.use(`${api}/products`,productsRouter)

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