const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//const authJwt = require('../helpers/jwt')

router.get('/', async(req,res)=>{

    const usersList = await User.find()//.select('name phone email')
    if(!usersList){
        res.status(500).json({sucess : false})
    }
    res.send(usersList);
})

router.get('/:id',async(req,res)=>{
    //CON SELECT AHREMOS UN FILTRADO COMO ANTERIORMENTE SE MENCIONO
    //EN ESTE CASO NO QUEREMOS QUE S EMUESTRE PASSWORD ASI QUE USAMOS -'SOMETHING'
    const user = await User.findById(req.params.id).select('-passwordHash')
    if(!user){
        res.status(500).json({sucess : false})
    }
    res.send(user);
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

router.post('/login',async(req,res)=>{
    const user  = await User.findOne({email : req.body.email})
    if(!user){
        return res.status(400).send('El usuario no pudo ser encontrado')
    }
    //DESPUES DE VERIFICAR QUE EL CORREO SE ENCUENTRA EN LA BASE DE DATOS NOS TOCARA
    //REVISAR QUE LA CONTRASEÑA ES LA ADECUADA ADEMAS, PARA HACER ESTO USAREMOS BCRYPT
    //PORQUE LA CONTRASEÑA FUE ANTERIORMENTE INCRIPTADA ASI QUE NECESITAMOS DESENCRIPTARLA
    if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
        
        const secret = process.env.secret
        const token = jwt.sign({
            userId : user.id
        },
        //USAREMOS EL PARAMETRO SECRET COMO FIRMA Y DECIR QUE EL TOKEN ES VALIDO
        //CON ESTO EL SERVIDOR SABE QUE EL TOKEN ES AUTENTICO Y NO ALGUIEN INTENTANDO HACER UNO FALSO
        secret,
        //ESTE APRAMETRO ES PARA OPCIONES EN ESTE CASO ELIGIRE EL TIMEPO DE EXPIRACION DEL TOKEN
        {expiresIn : '1d'}) 

        res.status(200).send({
            name : user.email,
            token : token
        })
    }else{
        res.status(400).send('La contraseña es incorrecta')
    }
    
})

module.exports = router ;