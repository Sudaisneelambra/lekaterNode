const express =require('express')
const router = express.Router()
const admin = require('../controllers/admincontroller')
router.post('/adduser', admin.addUser)


module.exports=router