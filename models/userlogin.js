const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true        
    },
    PhoneNumber:{
        type:Number,
        required:true
    },
    Isadmin:{
        type:Boolean,
        required:true,
        default:false
    }
})

module.exports = mongoose.model('users',userSchema)