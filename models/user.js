const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String,
    apartment : String,
    city : String,
    zip : String,
    country : String,
    phone : Number,
    isAdmin : Boolean

})

module.exports = mongoose.model('User' , userSchema);