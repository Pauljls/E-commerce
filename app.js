const express = require("express")
const app = express();
const bodyParser = require('body-parser')
/*ESTO NOS PERMITIRA USAR CONSTANTES ESPECIFICAS DE ARCHIVO .ENV */
require('dotenv/config')
/*CON ESTA LIBRERIA PODEMOS REGISTRAR LAS SOLICITUDES HTTPS */
const morgan = require('morgan')
/*CONEXION CON LA ABSE DE DATOS */
const mongoose = require('mongoose')


/*AQUI LLAMAMOS A LA CONSTANTE*/
const api=process.env.API_URL;

/*UN MIDDLEWARE ES UNA FUNCION QUE TIENE EL CONTROL DEL PEDIDO Y RESPEUSTA DE CUALQUIER API */
/*EN ESTE CASO ESTE MIDDLE WARE NOS AYDUARA A ANALI<AR MEJOR LA RESPUESTA DEL BODY EN EL FRONTEND */
/*CUANDNO EL FRONT END ENVIE UN OBJETO JSON NECESITAMOS QUE EL BACKEND ENTIENDA ENTIENDA ESTE JSON  */

app.use(bodyParser.json());
app.use(morgan('tiny'))


/*USAREMOS BACKTICKS PARA COMBINAR MEJOR EL TEXTO CON OBJETOS YA QUE,
NECESITAMOS QUE ESTO SEA DINAMICO */
app.get(`${api}/products`,(req,res)=>{
    const product= {
        id: 1,
        name: 'hair dresser',
        image: 'some_url'
    }
    res.send(product)
})

app.post(`${api}/products`,(req,res)=>{
    //CON ESTA INSTRUCCION PEDIMOS LOS DATOS DESDE EL FRONTEND
    const newProduct = req.body;
    console.log(newProduct)
    res.send(newProduct)
})

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
    console.log(api)
    console.log('el servidorar esta corriendo en http://localhost:3000')
})