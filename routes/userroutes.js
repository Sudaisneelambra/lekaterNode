const express = require('express')
const router= express.Router()
const users= require('../controllers/usercontroller')
const upload = require('../utils/ordercreationmulter')
const tockencheck= require('../middlewares/tockencheck')


router.post('/login',users.userlogin)
router.post('/createOrder',tockencheck,upload.single('imageUrl'),users.createOrder)
router.get('/getShops',tockencheck,users.getShops)
router.get('/getOrder',tockencheck,users.getOrder)
router.post('/getAllOrder',tockencheck,users.getAllOrder)
router.get('/getsingleorderdetails/:id',tockencheck,users.getsingleorderdetails)
router.patch('/orderdeliveried/:id',tockencheck,users.orderdeliveried)
router.post('/allDeliveredOrders',tockencheck,users.allDeliveredOrders)
router.post('/allPendingOrders',tockencheck,users.allPendingOrders)
router.patch('/cancelorder/:id',tockencheck,users.cancelorder)
router.get('/allcancelorder',tockencheck,users.allcancelorder)
router.get('/orderdetail/:id',tockencheck,users.orderdetail)
router.patch('/editOrder',tockencheck,upload.single('imageUrl'),users.editOrder)
router.get('/getsearchallorder',tockencheck,users.getsearchallorder)
router.get('/getsearchpendingorder',tockencheck,users.getsearchpendingorder)
router.get('/getsearchdeliveredorder',tockencheck,users.getsearchdeliveredorder)
router.get('/getsearchbydate',tockencheck,users.getsearchbydate)


module.exports=router
