const express = require('express')
const router= express.Router()
const users= require('../controllers/usercontroller')

router.post('/login',users.userlogin)
router.post('/createOrder',users.createOrder)

module.exports=router