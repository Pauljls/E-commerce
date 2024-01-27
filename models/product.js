const mongoose  = require('mongoose')

//PARA CREAR UN MODELO NECESITAMOS CREAR EL ESQUEMA
const productSchema = mongoose.Schema({
    name : String,
    image: String,
    //SI QUEREMOS AHCER UN ITEM REQUERIDO O DE LLENADO OBLIGATORIO
    //SERA DE LA SIGUIENTE MANERA
    countInStock : {
        type : Number,
        required : true
    }
})

//LOS MODELOS SIEMPRE SE ESCRIBEN CON LETRA CAPITAL
//EN ESTE PASO SE NOMBRA LA COLECCION Y LE ASIGNAMOS EL ESQUEMA
module.exports = mongoose.model('Product',productSchema);


