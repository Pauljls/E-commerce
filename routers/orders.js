const express = require('express') 
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/order')
const OrderItem = require('../models/order-item')
const order = require('../models/order')
const orderItem = require('../models/order-item')

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

module.exports = router;