const express = require('express')
const router = express.Router()
const Category = require('../models/category')

router.get('/',async(req,res)=>{
    const categoriesList = await Category.find()
    if(!categoriesList){
        res.status(500).json({sucess : false})
    }
    res.send(orderList);
})

module.exports = router ;