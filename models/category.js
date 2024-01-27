const mongoose = require('mongoose')
categorySchema = mongoose.Schema({
    name : String,
    color : String,
    icon : String,
    image : String
})


module.exports = mongoose.model('Category',categorySchema)