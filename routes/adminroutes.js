const express =require('express')
const router = express.Router()
const admin = require('../controllers/admincontroller')
router.post('/adduser', admin.addUser)
router.post('/addshop', admin.addShop)



module.exports=router