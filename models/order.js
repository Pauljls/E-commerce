const mongoose  = require('mongoose')
const product = require('./product')
const orderSchema = mongoose.Schema({
    orderItems : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
        require : true 
    }],
    shippingAddress1: {
        type : String,
        require : true
    },
    shippingAddress2: {
        type : String,
        require : true
    },
    city : {
        type : String,
        require :  true
    },
    zip: {
        type : String,
        require : true
    }, 
    country : {
        type : String,
        require : true
    }, 
    phone : {
        type : Number,
        require : true
    }, 
    st4tus: {
        type : String,
        require : true
    }, 
    totalPrice: {
        type : Number,
    }, 
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }, 
    dateOrdered: {
        type : Date,
        default : Date.now
    } 

})

module.exports =  mongoose.model('Order', orderSchema )