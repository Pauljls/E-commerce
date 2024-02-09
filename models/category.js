const mongoose = require('mongoose')
categorySchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    color : {
        type : String
    },
    icon : {
        type : String        
    },
    
})
module.exports = mongoose.model('Category',categorySchema)