const mongoose = require('mongoose')

const shopSchema = mongoose.Schema({
    shopName:{
        type: String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true        
    },
})

module.exports = mongoose.model('shops',shopSchema)