const express = require('express')
const router = express.Router();
const Product = require('../models/product')
const Category = require('../models/category')

/*USAREMOS BACKTICKS PARA COMBINAR MEJOR EL TEXTO CON OBJETOS YA QUE,
NECESITAMOS QUE ESTO SEA DINAMICO */
router.get(`/`, async (req,res)=>{
    //USAMOS AWAIT YA QUE QUIZAS AL MOMENDO DE ENVIAR LA RESPUESTA, 
    //AUN LA LISTA DE PRODUCTOS NO SE HA ENCONTRADO
    const productList = await Product.find();
    if(!productList){
        res.status(500).json({sucess:false})
    }
    res.send(productList);
})

router.post(`/`,async(req,res)=>{
    //CREACION DE LOS PRODUCTOS Y LLENADO DE LOS DATOS DESDE EL FORNTEND
    //COMO ESTAMOS USANDO EN UNA DE NUESTRAS PROPIEDADES EL ID DE OTRO MODELO
    //SERA NECESARIO BUSCAR YS ABER QUE EXISTE
    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid Category')
    let product = new Product({
        name : req.body.name,
        description : req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price:  req.body.price,
        category: req.body.category,
        countInStock :  req.body.countInStock,
        rating : req.body.rating,
        numReviews : req.body.numReviews,
        isFeatured:  req.body.isFeatured,
    })

    product = await product.save()
    
    if(!product)
    return res.status(500).send('El producto no puede ser creado')

    res.send(product)
})

module.exports = router;