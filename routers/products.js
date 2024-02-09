const express = require('express')
const router = express.Router();
const Product = require('../models/product')
const Category = require('../models/category');



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
    const category = await Category.findById(req.body.category)
    if(!category)
    res.status(500).send('La categoria no existe')
    
    const product = new Product({
        name : req.body.name,
        description : req.body.description,
        richDescription : req.body.description,
        image: req.body.image,
        images : req.body.images,
        brand : req.body.brand,
        price : req.body.price,
        category :req.body.category,
        countInStock : req.body.countInStock,
        rating : req.body.reating,
        numReviews : req.body.numReviews,
        isFeature: req.body.isFeature,
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

router.get('/:id',async(req,res)=>{
    //USAR FUNCIONES ASYNC Y AWAIT HACEN QUE EL CODIGO SE 
    //ASEMEJE MAS A UNA FORMA SINCRONICA POR LO QUE NO SERA 
    //NECESARIO USAR THEN Y CATCH
    const product = await Product.findById(req.params.id).populate('category')
    if(!product)
    return res.status(404).send({message : 'El producto no ha sido encontrado'})
    res.status(200).send(product)

})

router.delete('/:id',async(req,res)=>{
    const product = await Product.findByIdAndDelete(req.params.id)
    if(!product){
       return  res.status(200).send('Se elimino el producto con exito')
        
    }
    res.status(404).json({message : "El producto no existe"})
})

router.put('/:id',async(req,res)=>{
    const category = await Category.findById(req.body.category)
    if(!category){
        return res.status(404).json({message :'La categoria no existe'})
    }
    const product =  Product.findByIdAndUpdate(req.params.id,{
        name : req.body.name,
        description : req.body.description,
        richDescription : req.body.description,
        image: req.body.image,
        images : req.body.images,
        brand : req.body.brand,
        price : req.body.price,
        category :req.body.category,
        countInStock : req.body.countInStock,
        rating : req.body.reating,
        numReviews : req.body.numReviews,
        isFeature: req.body.isFeature,
    })
})

module.exports = router;