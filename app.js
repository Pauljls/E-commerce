const express = require("express")
const app = express();
const bodyParser = require('body-parser')
/*ESTO NOS PERMITIRA USAR CONSTANTES ESPECIFICAS DE ARCHIVO .ENV */
require('dotenv/config')

/*AQUI LLAMAMOS A LA CONSTANTE*/
const api=process.env.API_URL;

/*UN MIDDLEWARE ES UNA FUNCION QUE TIENE EL CONTROL DEL PEDIDO Y RESPEUSTA DE CUALQUIER API */
/*EN ESTE CASO ESTE MIDDLE WARE NOS AYDUARA A ANALI<AR MEJOR LA RESPUESTA DEL BODY EN EL FRONTEND */
/*CUANDNO EL FRONT END ENVIE UN OBJETO JSON NECESITAMOS QUE EL BACKEND ENTIENDA ENTIENDA ESTE JSON  */

app.use(bodyParser.json());


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

//WE SPECIFY 3000 AS A PORT AND THE THE PROCESS THAT WE WANT TO DO
app.listen(3000,()=>{
    console.log(api)
    console.log('el servidorar esta corriendo en http://localhost:3000')
})