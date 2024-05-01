const users = require('../models/userlogin')
const shops = require ('../models/shops')
const emails = require('../utils/emails')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const addUser= async (req, res) =>{
        try {
            const {username , email, phoneNumber} = req.body
            const existingUser= await users.findOne({email})
            if (existingUser) {
                res.json({
                    success:false,
                    message:'user already exists',
                })
            } else {
                const password = username.substring(0, 4).toUpperCase()+ phoneNumber.toString().substring(0, 4)
                const lowercaseusername= username.toLowerCase()
                emails(
                    email,
                    `ADMIN VERIFICATION EMAIL`,
                    lowercaseusername,
                    password
                ).then(async ()=>{
                    console.log('suucessfully mail sended');
                        const bcryptpassword= await bcrypt.hash(password, 10)
                        const newUser = new users({
                            username:lowercaseusername,
                            email,
                            phoneNumber,
                            password:bcryptpassword
                        })
                        await newUser.save()
                        res.json({
                            success:true,
                            message:'user added successfully',
                        })
                })
                .catch(err=>{
                    console.log(`errr ${err}`);
                    res.status(400).json({
                        message: 'email send failed'
                    })
                })
            }
        }
        catch (err) {
            console.log(err);
            res.status(400).json({
                message: 'User Adding Failed'
            })
        }
}

const addShop= async (req, res) =>{
    try {
        const {shopName,location, district} =req.body
        const existingShop = await shops.findOne({
            $and: [
              { shopName: shopName },
              { location: location },
              { district: district }
            ]
          });

          if (existingShop) {
            res.json({
                success:false,
                message:'shop is already exist'
            })
          } else {
            const newShop = new shops({
                shopName,
                location,
                district
            })
            await newShop.save()
            res.json({
                success:true,
                message:'shop added successfully'
            })
          }
    }
    catch(error){
        res.json({
            success:false,
            message:'shop adding failed'
        })
    }
}

module.exports ={addUser, addShop}