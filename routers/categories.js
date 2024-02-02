const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const category = require('../models/category')


router.get('/',async(req,res)=>{
    const categoriesList = await Category.find()
    if(!categoriesList){
        res.status(500).json({sucess : false})
    }
    res.send(categoriesList);
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