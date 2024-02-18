const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/',async(req,res)=>{
    const usersList = await User.find()
    if(!usersList){
        res.status(500).json({sucess : false})
    }
    res.send(usersList);
})

router.post('/',(req,res)=>{
    const user  = new User({
        name : req.body.name,
        email : req.body.email,
        //USARESMOS BCRYPT PARA ENCRIPTAR LA CONTRASEÑA
        //Y EL METODO ESPECIFICO APRA ESTO ES HASHSYC ADEMAS
        //AGREGAREMOS INFORMACION SECRETA EXTRA, EN ESTE CASO SERA CUALQUIER COSA
        passwordHash: bcrypt.hashSync( req.body.password,10),
        phone : req.body.phone, 
        street :req.body.street, 
        apartment: req.body.apartment,
        city : req.body.city,
        zip : req.body.zip,
        country : req.body.country,
        isAdmin : req.body.isAdmin,
    })
    
    user.save()
    .then( resp =>{
        return res.status(200).send(resp)
    })
    .catch( err =>{
        return res.status(500).send(err)
    })

})

module.exports = router ;