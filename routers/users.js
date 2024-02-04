const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/',async(req,res)=>{
    const usersList = await User.find()
    if(!usersList){
        res.status(500).json({sucess : false})
    }
    res.send(usersList);
})

router.post('/',async (req,res) =>{
    const user =  new User({
        name : req.body.name,
        email : req.body.email,
        passwordHash : req.body.passwordHash,
        street : req.body.street,
        apartment : req.body.apartment,
        city : req.body.city,
        zip : req.body.zip,
        country : req.body.country,
        phone : req.body.phones
    })
    await user.save()
    if( !user )
    return res.status(404).json({sucess : false, message : "No se pudo crear el usuario"})
    return res.send(user)
})

router.get('/',async(req,res)=>{
    const users = await User.find()
    if(!users){
        return res.status(404).json({
            success : false,
            message : 'No se encontraron usuarios'
        })
    }

    res.status(200).send(users)
})

router.get('/:id',async(req,res)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return res.status(404).json({
            success :false,
            message : 'El usuarion no existe'
        })
    }

    res.status(200).send(user)
})

router.put('/:id',async(req,res)=>{
    const user  =   await User.findByIdAndUpdate(req.params.id,{
        name : req.body.name,
        email : req.body.email,
        passwordHash : req.body.passwordHash,
        street : req.body.street,
        apartment : req.body.apartment,
        city : req.body.city,
        zip : req.body.zip,
        country : req.body.country,
        phone : req.body.phones
    })
    if(!user){
        return res.status(404).json({
            success :false,
            message : 'El usuarion no existe'
        })
    }
    res.status(200).send(user)
})

router.delete('/:id',async(req,res)=>{
    const user =  await User.findByIdAndDelete(req.params.id)
    .then(()=>{
        return res.status(200).json({message : 'El usuario ha sido eliminado con exito'})
    })
    .catch(err => res.status(404).send(err))
})

module.exports = router ;