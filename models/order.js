const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    shopName:{
        type: String,
        required:true
    },
    itemName:{
        type:String,
        required:true
    },
    fabricNameAndCode:{
        type:String,
        required:true        
    },
    imageUrl:{
        type:String,
        required:true,
    },
    itemDescription:{
        type:String,
        required:true,
    },
    orderReceivedDate:{
        type:Date,
        required:true,
    },
    expectingDeliveryDate:{
        type:Date,
        required:true,
    },
    cancelStatus:{
        type:Boolean,
        required:true,
        default:false
    },
    orderDeliveriedStatus:{
        type:Boolean,
        required:true,
        default:false
    },
})

module.exports = mongoose.model('orders',orderSchema)