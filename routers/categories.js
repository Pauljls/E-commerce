const express = require('express')
const router = express.Router()
const Category = require('../models/category')


router.get('/',async(req,res)=>{
    const categoriesList = await Category.find()
    if(!categoriesList){
        res.status(500).json({sucess : false})
    }
    res.send(categoriesList);
})

//PEDIR DATOS POR ID, este nos devolvera solo un elemento
router.get('/:id',async(req,res)=>{
    const category = await Category.findById(req.params.id)
    if(!category){
    //con la fuincion json convertimos un objeto a json en este caso pasamos un objeto con algun contenido que querramos ver y
    //lo convertimos a json para poder verlo por consola
        return res.status(500).json({message: "La categoria con el ID brindado no existe"})
    }

    res.status(200).send(category);
})

router.post('/',async(req,res)=>{
    let category = new Category({
        //CCON REQ.BODY INDICAMOS QUE PEDIMOS LOS DATOS DEL
        //FRONT END
        name : req.body.name,
        icon : req.body.icon,
        color : req.body.color,
    })
    //LA INSTRUCCION SAVE ES UN PROMESA POR LO QUE PODEMOS USAR THEN O CATCH
    category = await category.save()

    //.then(()=>{
    //    console.log("Se ha creado una categoria")
    //})
    //.catch((err)=>{
    //    console.log("Se ha generado un error: ",err)
    //}) O TAMBIEN PODEMOS USAR UN IF

    if(!category)
    return res.status(404).send("The category cannot be created")

    res.send(category);

})

router.put('/:id',async(req,res)=>{
    const category = await Category.findByIdAndUpdate(req.params.id , {
    //Para hacerlo mas sencillo podemos decir que re.body es
    //requerimos del cuerpo en el frontend ya sea la vista o no,
    //y leugo especificamos que aprte en el cuerpo ya se el nombre u otra cosa 
        name : req.body.name,
        icon : req.body.icon,
        color : req.body.color

    //SIEMPRE AL BUSCAR NOS DARA EL OBJETO ANTES DEL CAMBIO QUE DESEEMOS HACER ASI QUE
    //AORA MOSTRARNOS EL OBEJTO CON LOS CAMBIOS DEBEMOS AGREGAR EL OBETO CON NEW    
    }, {new :true})
    if(!category){
        return res.status(404).json({success : false , message : "No se encontro la categoria"})
    }

    res.send(category)
})
//api/v1/23151sad
router.delete('/:id',(req,res)=>{
    //DE ESSTA FORMA OBTENDREMOS EL ID DESDE EL URL CON PARAMS
    Category.findByIdAndDelete(req.params.id)
    .then(category => {
        if(category){
            return res.status(200).json({success : true , message : 'La categoria ha sido encontrada'})
        }else{
            return res.status(404).json({success :  true, message : 'La categoria no puso ser encontrada'})
        }
    })
    .catch(err=>{
        return res.status(400).json({success : true, message : err})
    })
})

//PODMEOS ELEGIR HACERL LA PETICION HTTP COMO CON EL GET CON ASYNC O CON EL DELTE CON UNA PROMESA NORMAL

module.exports = router ;