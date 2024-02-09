const express = require('express') 
const router = express.Router()
const Order = require('../models/order')
const Product = require('../models/product')
const User  = require('../models/user')


router.get('/',(req,res)=>{
    const ordersList = Order.find()
    if(!ordersList){
        res.status(500).json({sucess: false})
    }
    res.status(200).send(ordersList)
})

router.post('/',async(req,res)=>{

    let order = new Order({
        orderItems : req.body.orderItems,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city : req.body.city,
        zip: req.body.zip, 
        country :req.body.country, 
        phone : req.body.phone, 
        status: req.body.status, 
        totalPrice: req.body.totalPrice, 
        user: req.body.user  
    })
    order.save()
    if(!order){
        res.status(500).send('No se pudo crear la orden')
    }
    res.status(200).send(order)  
})

router.get('/id:',(req,res)=>{
    const order = Order.findById(req.params.id).populate('product','user')
    if(!order){
        return res.status(404).json({message: 'No se pudo crear el objeto'})
    }
    res.status(200).send(order)
})

module.exports = router;