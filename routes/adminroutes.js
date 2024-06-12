const express =require('express')
const router = express.Router()
const admin = require('../controllers/admincontroller')
const tokencheck = require('../middlewares/tockencheck')

router.post('/adduser',tokencheck, admin.addUser)
router.get('/showUsers',tokencheck, admin.showUser)
router.patch('/changeStatus',tokencheck, admin.blockAndUnblockUser)
router.post('/addshop',tokencheck, admin.addShop)
router.get('/showShops',tokencheck, admin.ShowShops)
router.patch('/deleteUndoShops',tokencheck, admin.deleteAndUndoShops)



module.exports=router