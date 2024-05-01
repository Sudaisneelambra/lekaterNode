const users = require('../models/userlogin')
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

module.exports ={addUser}