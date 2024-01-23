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

/*UN MIDDLEWARE ES UNA FUNCION QUE TIENE EL CONTROL DEL PEDIDO Y RESPEUSTA DE CUALQUIER API */
/*EN ESTE CASO ESTE MIDDLE WARE NOS AYDUARA A ANALI<AR MEJOR LA RESPUESTA DEL BODY EN EL FRONTEND */
/*CUANDNO EL FRONT END ENVIE UN OBJETO JSON NECESITAMOS QUE EL BACKEND ENTIENDA ENTIENDA ESTE JSON  */

app.use(bodyParser.json());
app.use(morgan('tiny'))

//PARA CREAR UN MODELO NECESITAMOS CREAR EL ESQUEMA
const productSchema = mongoose.Schema({
    name : String,
    image: String,
    //SI QUEREMOS AHCER UN ITEM REQUERIDO O DE LLENADO OBLIGATORIO
    //SERA DE LA SIGUIENTE MANERA
    countInStock : {
        type : Number,
        required : true
    }
})

//LOS MODELOS SIEMPRE SE ESCRIBEN CON LETRA CAPITAL
//EN ESTE PASO SE NOMBRA LA COLECCION Y LE ASIGNAMOS EL ESQUEMA
const Product = mongoose.model('Product',productSchema);

/*USAREMOS BACKTICKS PARA COMBINAR MEJOR EL TEXTO CON OBJETOS YA QUE,
NECESITAMOS QUE ESTO SEA DINAMICO */
app.get(`${api}/products`,async (req,res)=>{
    //USAMOS AWAIT YA QUE QUIZAS AL MOMENDO DE ENVIAR LA RESPUESTA, 
    //AUN LA LISTA DE PRODUCTOS NO SE HA ENCONTRADO
    const productList = await Product.find()
    res.send(productList)
})

app.post(`${api}/products`,(req,res)=>{
    //CREACION DE LOS PRODUCTOS Y LLENADO DE LOS DATOS DESDE EL FORNTEND
    const product = new Product({
        name : req.body.name,
        image: req.body.image,
        countInStock :  req.body.countInStock
    })

    product.save()
    //CON ESTA LINEA DESPEUS DE GUARDAR LA INFORMACION QUEREMOS INDICAR UNA CONFOMACION DEL ENVIO
    //DE DATA CON 201 Y ADEMAS VER LOS DATOS EN FORMATO JSON
    .then(createProducts=> res.status(201).json(createProducts))
    .catch((err)=>{
        res.status(500).json({
            error: err,
            sucess: false
        })
    })

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