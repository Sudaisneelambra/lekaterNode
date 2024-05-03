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



module.exports=router
