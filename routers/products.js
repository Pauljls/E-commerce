const express = require('express')
const router = express.Router();
const Product = require('../models/product')

/*USAREMOS BACKTICKS PARA COMBINAR MEJOR EL TEXTO CON OBJETOS YA QUE,
NECESITAMOS QUE ESTO SEA DINAMICO */
router.get(`/`, async (req,res)=>{
    //USAMOS AWAIT YA QUE QUIZAS AL MOMENDO DE ENVIAR LA RESPUESTA, 
    //AUN LA LISTA DE PRODUCTOS NO SE HA ENCONTRADO
    const productList = await Product.find();
    res.send(productList)
})

router.post(`/`,(req,res)=>{
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

module.exports = router;