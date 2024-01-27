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

module.exports = router;