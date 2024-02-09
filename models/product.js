const mongoose  = require('mongoose')

//PARA CREAR UN MODELO NECESITAMOS CREAR EL ESQUEMA
const productSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,

    },
    description : {
        type: String,
        required : true,

    },
    richDescription : {
        type : String,
        default : ''
    },
    image: {
        type : String,
        default : ' '
    },
    //DE ESTA FORMA DEFINIMOS QUE UN ITEM SERA UN ARRAY, 
    //POR DENTRO IRA LA FORMA DEL OBJETO QUE ESTAMOS CREANO
    //EN ESTE CASO UN ARRAY DE STRINGS
    images : [{
        type : String,

    }],
    brand : {
        type : String,
        required : true
    },
    price: {
        type : Number,
        default : 0,

    },
    //CUANDO QUIERA AGREGAR UN  PRODUCTO USARE EL ID D ELA CATEGORIA, Y CREAREMOS EL ENLACE ENTRE AMBOS
    //ESQUEMAS DE LASIGUIENTE FORMA, EN ESTE CASO EL LINK ES LA CATEGORIA
    category: {
        //AQUI HACEMOS REFERENCIA A QUE EL TIPO SERA DE UN ELEMENTO DENTRO DE UN ESQUEMA DE MONGOOSE
        type : mongoose.Schema.Types.ObjectId,
        //ANTERIORMENTE SE DIJO QUE USAREMOS EL ID PERO AUN NO ESPECIFICAMOS QUE
        //ESQUEMA SERA ELQUE USAREMOS APRA ESTO SERA NECESARIO USAR UNA NEFERENCIA
        //EL NOMBRE QUE ASIGNEMOS EN LA REFERENCIA SIEMPRE
        //DEBERA SER CON ELQUE ASIGNMAOS COMO MODELO NO COMO
        //SCHEMA
        ref : 'Category',
        required :true 
    },
    countInStock: {
        type : Number,
        default : 0,
        //PROPEIDAD ESPECIAL APRA ESTABLECER UN RANGO 
        min: 0,
        max: 255
    },
    rating :{
        type: Number,
        default : 0
    },
    numReviews: {
        type : Number,
        default :  0
    },
    isFeature : {
        type: Boolean,
        default:  false
    },
    dateCreated : {
        type : Date,
        default : Date.now
    }


})

//LOS MODELOS SIEMPRE SE ESCRIBEN CON LETRA CAPITAL
//EN ESTE PASO SE NOMBRA LA COLECCION Y LE ASIGNAMOS EL ESQUEMA
module.exports = mongoose.model('Product', productSchema);

//DE ESTA FORMA TAMBIEN FUNCIONA
//exports.Product = mongoose.model('Product', productSchema)
