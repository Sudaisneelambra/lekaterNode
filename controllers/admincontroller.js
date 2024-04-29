const users = require('../models/userlogin')
const emails = require('../utils/emails')

const addUser= async (req, res) =>{
        try {
            const {username , email, phoneNumber} = req.body
            console.log(req.body);
            const existingUser= await users.findOne({email})
            if (existingUser) {
                res.json({
                    success:false,
                    message:'user already exists',
                })
            } else {
                const password = username.substring(0, 4).toUpperCase()+ phoneNumber.toString().substring(0, 4)
       
                emails(
                    email,
                    `ADMIN VERIFICATION EMAIL`,
                    username,
                    password
                ).then((res)=>{
                    console.log('suucessfully mail sended');
                        // const newUser = new users({
                        //     username,
                        //     email,
                        //     phoneNumber,
                        //     password
                        // })
                        // await newUser.save()
                })
                .catch(err=>{
                    console.log(`errr ${err}`);
                    res.status(400).json({
                        message: 'email send failed'
                    })
                })

                res.json({
                    success:true,
                    message:'user added successfully',
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