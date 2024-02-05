const express = require('express')
const router = express.Router();
const Product = require('../models/product')
const Category = require('../models/category')


//PEDIR TODOS LOS PRODUCTOS,UNA LISTA
router.get(`/`, async (req,res)=>{
    //PODEMOS ADEMAS HACER QUERYS PARA TENER UNA PRESENTACION MAS LIMPIA
    //EN ESTE CASO ELIMINARESMOS EL ID YA QUE SIEMPRE SE MUESTRA POR DEFECTO
    const productList = await Product.find().populate('category');//SI QUEREMOS INDICAR QUE NO S EMEUSTRE ALGO SUAREMOS -
    
    if(!productList){
        res.status(500).json({sucess:false})
    }
    res.send(productList);
})

//CREACION DE UN PRODUCTO
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

//PEDIR UN SOLO PRODUCTO
router.get('/:id',async(req,res)=>{
    //Populate ayuda a que si hay algun id u otro campo de otra tabla,entonces este lo
    //mostrara en el campo que se invoca
    const product = await Product.findById(req.params.id).populate('category')
    if(!product){
        return res.status(400).json({message : "El producto no existe"})
    }
    res.status(200).send(product)
})


router.put('/:id', async(req,res)=>{
    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid Category')
    const product = await Product.findByIdAndUpdate(req.params.id,{
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
    },
    {new : true})
    if(!product){
        return res.status(404).json({message : "El usuario no puede actualziarce"})
    }
    res.status(200).send(product)
})

module.exports = router;