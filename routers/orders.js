const express = require('express') 
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/order')
const OrderItem = require('../models/order-item')

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

        console.log(orderItemsIds)
        //const orderItems = await Promise.all(orderItemsPromises);

        //FINALMENTE RESOLVEMOS LA PROMESA COMPBIANDA DE TODO EL ARRAY DE PROMESAS 
        const orderItemsIdsResolved = await orderItemsIds

        let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: req.body.totalPrice,
            user: req.body.user
        });

        order = await order.save();

        res.status(201).send(order);

});

module.exports = router;