const users = require("../models/userlogin");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const sercretKey= process.env.JWT_SECRETKEY

const userlogin = async (req, res) => {
  try {
    const { password, email } = req.body;
    console.log(email);
    console.log(password);
    console.log(req.body);
    const mailexist = await users.findOne({ email });
    console.log(mailexist);
    if (mailexist) {
      const passworddecode = await bcrypt.compare(password, mailexist.password)
      if (passworddecode) {
            if(!mailexist.blockStatus){
                const token = jwt.sign(
                    {
                    name:mailexist.username,
                    email:mailexist.email,
                    phonenumber:mailexist.phoneNumber,
                    type:'user'
                    },
                    sercretKey,
                    { expiresIn: '1h' } 
                )
                res.json({
                  success:true,
                  token:token,
                  message: "login successfull",
                });
            } else {
                res.json({
                    success:false,
                    message: "admin blocked user access",
                  });
            }
      } else {
        res.json({
            success:false,
            message: "password incorrect",
        });
      }
    } else {
        res.json({
            success:false,
            message: "User Not Found",
          });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
        message:'Userdata fetching failed'
    })
  }
};

const createOrder= async (req, res) =>{
  try {

  } catch (err) {

  }
}

module.exports = { userlogin ,createOrder};
