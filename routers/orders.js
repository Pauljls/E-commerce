const express = require('express') 
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/order')
const OrderItem = require('../models/order-item')
const order = require('../models/order')


router.get('/',async(req,res)=>{
    //PODEMOS ESCOOGER EL NOMBRE DEL CAMPO QUE ES OTRO MODELO COMO PRIEMR PARAMETRO Y ADEMAS
    //PEDIR INFORMACION DE UNO DE SUS CAMPOS, ESTE CASO QUEREMOS VER EN LA CONSULTA GET LOS DATOS DEL USUARIO
    //Y ADEMAS SU NOMBRE

    //ADEMAS PODEMOS USAR .SORT PARA ORDERNAR LOS ITEMS, EN ESTE CASO PEDIMOS EN BASE AL MAS VIEJO AL MAS NUEVO
    //PERO SI USAMO ADEMAS UN VALOR DE MENUS ES DECIR dateOrdered: -1 LO ORDENAREMOS AL REVEZ ES DECIR DEL MAS NUEVO
    //AL MAS VIEJO
    const orderList = await Order.find().populate('user','name').sort({
        "dateOrdered" : -1
    })
    if(!orderList){
        res.status(500).json({success : false})   
    }
    res.send(orderList)
})

router.get('/:id',async(req,res)=>{
    const orderList = await Order.findById(req.params.id).populate('user','name').
    //SI QUEREMOS QUE SE MEUSTREN DATOS DE DOS NIVELES A MAS DE POPULATE NECESITAREMOS HACERLO
    //DE LA SIGUIENTE AMNERA EN LA QUE MOSTRARSMOS NO SOLO LOS ITEMS SINO SU CATEGORIA
    populate({path : 'orderItems', populate : {
        path : 'product' , populate : 'category'
    }})
    if(!orderList){
        res.status(500).json({success : false})   
    }
    res.send(orderList)
})

router.post('/', async (req, res) => {
//COMBINANDO TODAS LAS PROMISAS YA QUE CREAMOS UN ARRAY DE PROEMESAS 
        const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            });
            newOrderItem = await newOrderItem.save();
            return newOrderItem._id
        }));

        //console.log(orderItemsIds)
        //const orderItems = await Promise.all(orderItemsPromises);

        //FINALMENTE RESOLVEMOS LA PROMESA COMPBIANDA DE TODO EL ARRAY DE PROMESAS 
        const orderItemsIdsResolved = await orderItemsIds


        //AQUI TRATERMOS DE CREAR UN ARRERLO CON LOS PRECIOS TOTALES DE CADA ITEM, RECORRRIENDO 
        //EL ARRAY DE ID E INVOCANDO LOS OBJETOS CON FINDBYID, RECORDAR QUE ESTE TIPO DE OPERACION NECESITAN 
        //RESOLVERSE COMO UNA PROMESA CONJUNTA EN REPRESENTACION DE TODOS CON PROMMISE ALL
        const totalPrices = await Promise.all(orderItemsIdsResolved.map(async orderItemId => {
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
            const totalPrice = orderItem.product.price * orderItem.quantity
            return totalPrice
        }))


        console.log( totalPrices)
        //CON LA FUNCION REDUCE, ESTA BUSCA COLAPSAR UN ARRAY EN UN SOLO ELEMENTO,
        //EN ESTE CASO LO COLAPSAREMOS EN EL VALOR TOTAL DE TODOS SUS ELEMENTOS,
        //DONDE REDUCE SIEMPRE ACEPTARA UNA FUNCION COMO APRAMETRO O CALLBACK Y UN VALOR INICAL
        //EN ESTE CASO ES CERO Y LA FUNCION ES UNA SUMA DON A SERA EL ACUNUADOR Y B EL ELEMNTO ACTUAL
        const totalPrice = totalPrices.reduce((a,b)=> a+b,0)

        

        let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user
        });

        order = await order.save();

        res.status(201).send(order);

});

router.put('/:id',async(req,res)=>{
    let order = await Order.findByIdAndUpdate(req.params.id,{
        status : req.body.status
    },{new:true})
    if(!order)
    return res.status(400).send('La categoria no pudo ser actualziada')
    res.status(200).send(order)
})

router.delete('/:id',(req,res)=>{
    Order.findByIdAndDelete(req.params.id)
    .then(  async order => {
        if(order){
            //UNA VEZ ELIMINAMOS EL OBJETO TENDREMOS QUE ELIMINAR LOS ELEMENTOS QUE SE GENERARON CON EL
            //ENE ESTE CASO LOS ORDEITEMS, ESTOS SE PODRAN ELIMINAR COMOO SE CREARON MEDIANTE UN RECORRIDO
            //USANDO MAP, ESTE SERA UNA OPERACION EN LA BD POR LO QUE TENDREMOS QUE USAR AWAIT POR CONSECUENTE
            //SERA UNA FUNCION ANSINCRONICA EN SU TOTALIDAD
            await order.orderItems.map(  async item => { await orderItem.findByIdAndDelete(item)} )
            return res.status(200).send({success :  true ,  message : "La orden se elimino con exito"})
        }else{
            return res.status(400).send({success :  false, message: "La orden no existe"})
        }
    })
    .catch(err => res.status(500).send({success :false,  message: err}))

})


router.get('/get/totalsales',async (req,res)=>{
    
    //LA FUNCION AGREGATE FUNCIONARA COMO UN JOIN
    //YA QUE AGRUPARA CON $GROUP INFORMACION MOSNTRANDONOS LA INFORMACION
    //COMPARTIDA EN ESTE CASO NOS MOSTRARA EL PRECIO TOTAL


    //PARA GENERA LA SUMA TOTAL USAMO LA PALABRA RESERVADA $SUM Y LUEGO 
    //PASAMO LOS DATOS QUE VAMOS A QUERER SUAMR CON $ EN ESTE CASO EL PRECIO TOTAL
    const totalsales =  await Order.aggregate([
        {$group:{_id: null,totalsales : {$sum : '$totalPrice'}}}
    ])

    if(!totalsales){
        return res.status(400).send('La orden no pudo ser generada')
    }
    //CON ESTA INSTRUCCION ESTAMOS EXTRAYENDO EL UNICO ELEMNTO DE ARRAY Y ACCEDEMOS AL ATRIBUTO 
    //DE TOTALSALES
    res.send({totalsales :  totalsales.pop().totalsales})
})


router.get('/get/count',async(req,res)=>{
    const countotal =  await Order.countDocuments()
    if(!countotal){
        return res.status(400).send('No se pudo contar los docuemtnos')
    }
    res.status(200).send({productCount : countotal})
})

router.get('/get/userorders/:id',async(req,res)=>{
    const orderList = await Order.find({user : req.params.id}).populate('user','name').populate({
        path: 'orderItems', populate: {
            path: 'product', populate : 'category'
        }}).sort({
        "dateOrdered" : -1
    })
    if(!orderList){
        res.status(500).json({success : false})   
    }
    res.send(orderList)
})

module.exports = router;