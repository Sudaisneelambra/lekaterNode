const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    shopName:{
        type: mongoose.Types.ObjectId,
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
    orderRecivedBy:{
        type:String,
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
    editstatus:{
        type:Boolean,
        required:true,
        default:false
    },
    editedperson:{
        type:String,
        default:null
    },
    DeliveredDate:{
        type:Date,
        default:null
    },
    EditDate:{
        type:Date,
        default:null
    }

})

module.exports = mongoose.model('orders',orderSchema)