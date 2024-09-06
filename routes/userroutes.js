const express = require('express')
const router= express.Router()
const users= require('../controllers/usercontroller')
const upload = require('../utils/ordercreationmulter')
const tockencheck= require('../middlewares/tockencheck')

const userAllOrder = require('../controllers/userAllOrder')
const userDeliveredOrder = require('../controllers/userAllDeliveredOrder')
const userPendingOrder = require('../controllers/uselAllPendingOrderDetails')
const editAndcreate = require('../controllers/creatAndEdirOrder')


router.post('/login',users.userlogin)
router.get('/getShops',tockencheck,users.getShops)
router.get('/getOrder',tockencheck,users.getOrder)

// all orders
router.post('/getAllOrder',tockencheck,userAllOrder.getAllOrder)
router.get('/getsearchallorder',tockencheck,userAllOrder.getsearchallorder)


// all delivered Orders
router.patch('/orderdeliveried/:id',tockencheck,userDeliveredOrder.orderdeliveried)
router.post('/allDeliveredOrders',tockencheck,userDeliveredOrder.allDeliveredOrders)
router.get('/getsearchdeliveredorder',tockencheck,userDeliveredOrder.getsearchdeliveredorder)

// all pending
router.post('/allPendingOrders',tockencheck,userPendingOrder.allPendingOrders)
router.get('/getsearchbydate',tockencheck,userPendingOrder.getsearchbydate)
router.get('/getsearchpendingorder',tockencheck,userPendingOrder.getsearchpendingorder)

// edit and create order
router.post('/editOrder',(req,res,next)=>{console.log('anux'); next()},tockencheck,upload.single('imageUrl'),editAndcreate.editOrder)
router.post('/createOrder',tockencheck,upload.single('imageUrl'),editAndcreate.createOrder)


router.get('/getsingleorderdetails/:id',tockencheck,users.getsingleorderdetails)
router.patch('/cancelorder/:id',tockencheck,users.cancelorder)
router.get('/allcancelorder',tockencheck,users.allcancelorder)
router.get('/orderdetail/:id',tockencheck,users.orderdetail)


module.exports=router
