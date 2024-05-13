const users = require("../models/userlogin");
const emails = require("../utils/emails");
const shops = require ('../models/shops')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const addUser= async (req, res) =>{
    try {
        const {username , email, phoneNumber} = req.body
        const existingUser= await users.findOne({email})
        if (existingUser) {
            res.status(400).json({
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

const showUser = async (req, res) => {
  try {
    const userList = await users.find();
    if (userList.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res
      .status(200)
      .json({ message: "Users retrieved successfully", userList });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const blockAndUnblockUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.blockStatus = !user.blockStatus;
    await user.save();
    return res
      .status(200)
      .json({ message: "Block status updated successfully", user });
  } catch (error) {
    console.error("Error updating block status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const ShowShops = async (req, res) => {
  try {
    const allShops = await shops.find();
    res.json({allShops});
  } catch (error) {
    console.error('Error fetching shops with delete status false:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteAndUndoShops = async (req, res) => {
  try {
    const { shopId } = req.body;
    const shop = await shops.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    shop.deleteStatus = !shop.deleteStatus;
    await shop.save();
    res.json({ message: 'Delete status updated successfully' });
  } catch (error) {
    console.error('Error updating delete status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = { addUser, showUser, blockAndUnblockUser, addShop, ShowShops, deleteAndUndoShops };
