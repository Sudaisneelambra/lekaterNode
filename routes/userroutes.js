const express = require('express')
const router= express.Router()
const users= require('../controllers/usercontroller')
const upload = require('../utils/ordercreationmulter')
const tockencheck= require('../middlewares/tockencheck')


router.post('/login',users.userlogin)
router.post('/createOrder',tockencheck,upload.single('imageUrl'),users.createOrder)
router.get('/getShops',tockencheck,users.getShops)
router.get('/getOrder',tockencheck,users.getOrder)
router.get('/getAllOrder',tockencheck,users.getAllOrder)
router.get('/getsingleorderdetails/:id',tockencheck,users.getsingleorderdetails)
router.patch('/orderdeliveried/:id',tockencheck,users.orderdeliveried)
router.get('/allDeliveredOrders',tockencheck,users.allDeliveredOrders)
router.get('/allPendingOrders',tockencheck,users.allPendingOrders)
router.patch('/cancelorder/:id',tockencheck,users.cancelorder)
router.get('/allcancelorder',tockencheck,users.allcancelorder)
router.get('/orderdetail/:id',tockencheck,users.orderdetail)
router.post('/editOrder',tockencheck,upload.single('imageUrl'),users.editOrder)

module.exports=router
