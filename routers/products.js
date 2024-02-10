const express = require('express')
const router = express.Router();
const Product = require('../models/product')
const Category = require('../models/category');
const mongoose = require('mongoose')


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
    //NECESITAMO VALIDAR LOS IDS, ESTO ES MAS EFECTIVO AL HACERCE MEDIANTE
    //UNA PROMESA YA QUE PODEMOS CATURAR EL ERROR Y MOSTRARLO, CASO CONTRARIO
    //JAMAS TERMINARA DE EVLAUARSE EL CODIGO, PERO SI QUEREMOS MANTENER LA ESTRUCTURA SIN
    //PROMESA PODEMOS USAR UN METODO DE MONGOOSE

    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product ID')
    }

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


router.delete('/:id',(req,res)=>{
    //DE ESSTA FORMA OBTENDREMOS EL ID DESDE EL URL CON PARAMS
    Product.findByIdAndDelete(req.params.id)
    .then(product => {
        if(product){
            return res.status(200).json({success : true , message : 'El producto ha sido encontrada'})
        }else{
            return res.status(404).json({success :  true, message : 'El producto no pudo ser encontrada'})
        }
    })
    .catch(err=>{
        return res.status(400).json({success : true, message : err})
    })
})

router.get('/get/count',async(req,res)=>{
    //MONGOOSE NOS PROPORCIONARA ALGUNOS METODOS PARA BRINDAR
    //DATOS ESTADISTICOS AL CLIENTE
    const productCount = await Product.countDocuments()

    if(!productCount){
        return res.status(500).json({succes:false})
    }
    res.status(200).send({
        productCount : productCount
    })
})

//1.LA PROPIEDAD ISFEATURED, NOS INDICARA SI EL ELEMENTO SERA MOSTRADO
//  O NO EN HOME PAGE POR ESO TIENE UN VALOR DE TRUE O FALSE
//  PARA ESTO TOMAREMOS L CASO ANTERIOR
router.get('/get/featured',async(req,res)=>{

    //CON LA SIGUIENTE LINEA DE CODIGO BUSCAMOS YA NO POR ID
    //SINO POR EL ATRIBUTO O VALOR DE ESTE QUE ESPEREMOS QUE TENGA
    //EN ESTE CASO QUEREMOS SOLO LOS QUE TENGAN VALOR TRUE EN ISFEATURED
    const product = await Product.find({isFeatured : true})

    if(!product){
        return res.status(500).json({succes:false})
    }
    res.status(200).send(product)
})

//2.PODEMOS LIMITAR LA CANTIDAD QUE QUEREMOS QUE SEA MOSTRADA TAMBIEN EN ESTE CASO LO HARMEOS MEDIANTE 
//  LA URL, ES DECIR EL SUUSAIRO NOS INDICARA MEDIANTE LA URL LA CANTIDAD QUE SE DESEA MOSTRAR

router.get('/get/featured/:count',async(req,res)=>{

    //esta sintaxis es similar a un if , empieza con una pregunta
    //y luego responde en caso todo haya salido bien, sino se da la otra
    //opcion despues de los dos puntos
    // 2+2 === 5 ? 5 : 4
    //en este caso en concreto si encuentra un valor en count lo asigna en  caso no enviara un cero

    const count  =  req.params.count ? req.params.count: 0

    //usaremos el metodo limit para solo mostrar la cantidad que queramos,
    //en este caso la cantidad asignada en la url

    //como dato extra la constante al recuperar valores de params este sera un string
    //para no complicarnos para transformarlo en un numero pondremos un signo mas a su costado
    const product = await Product.find({isFeatured : true}).limit(+count)

    if(!product){
        return res.status(500).json({succes:false})
    }
    res.status(200).send(product)
})

module.exports = router;