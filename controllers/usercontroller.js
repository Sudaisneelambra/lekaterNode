const users = require('../models/userlogin')

const userlogin= async (req, res)=>{
   try {
    const {username,password,email} =req.body
    const user = await users.find({email})
    const {name}= req.body
    console.log(req.body);
    res.json(name)
   } 
   catch (err) {

   }
}


module.exports={userlogin}