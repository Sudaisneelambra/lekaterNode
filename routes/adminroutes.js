const express =require('express')
const router = express.Router()
const admin = require('../controllers/admincontroller')
router.post('/adduser', admin.addUser)
router.get('/showUsers', admin.showUser)
router.patch('/changeStatus', admin.blockAndUnblockUser)

module.exports=router