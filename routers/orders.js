const express = require('express') 
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/order')

router.get('/',(req,res)=>{
    const ordersList = Order.find()
    if(!ordersList){
        res.status(500).json({sucess: false})
    }
})

router.post('/',async(req,res)=>{
    const order = new Order({
        orderItems: req.body.orderItems,
        shippingAddress1 : req.body.shippingAddress1, 
        shippingAddress2 : req.body.shippingAddress2,
        city : req.body.city,
        zip : req.body.zip,
        country : req.body.country,
        phone : req.body.phone,
        status : req.body.status,
        totalPrice : req.body.totalPrice,
        user : req.body.user
    })
    await order.save()

    if(!order){
        return res.status(400).send('La orden no puede ser creada')
    }
    res.send(order);

})

module.exports = router;