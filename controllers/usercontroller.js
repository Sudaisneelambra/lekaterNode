const users = require("../models/userlogin");
const orders= require('../models/order')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const shopsModel= require('../models/shops')
const sercretKey= process.env.JWT_SECRETKEY
const mongoose = require('mongoose');

const userlogin = async (req, res) => {
  try {
    const { password, email } = req.body;
    const mailexist = await users.findOne({ email });
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

const createOrder = async (req, res) => {
  try {
    const {shopName,itemName,fabricNameAndCode,itemDescription,orderReceivedDate,expectingDeliveryDate} =req.body

    const filePath = req?.file?.location;
    const username= req?.tokens?.name

    const neworder= new orders({
      shopName,
      itemName,
      fabricNameAndCode,
      imageUrl:filePath,
      itemDescription,
      orderReceivedDate,
      expectingDeliveryDate,
      orderRecivedBy:username,
      editedperson:' '
    })

    await neworder.save();
    res.json({
      success:true,
      message: "Order Created Successfully",
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getShops= async (req, res)=>{
  try{
    const shops = await shopsModel.find({});
    res.json({
      success:true,
      message:'shops getting successfully',
      data:shops
    })
  }
  catch(err) {
    console.log(err);
    res.status(400).json({
      success:false,
      message:'shops getting failed'
    })
  }
}

const getOrder= async ( req, res)=>{
  try{
    const order = await orders.aggregate([
      {
        $match: {
          cancelStatus: false,
          orderDeliveriedStatus: false
        }
      },
      {
        $lookup: {
          from: 'shops', 
          localField: 'shopName', 
          foreignField: '_id', 
          as: 'shopdetails' 
        }
      }
    ]);
    if(order) {
      res.json({
        success:true,
        message:'order getting successfully',
        data:order
      })
    }
  } 
  catch(err) {
    console.log(err);
    res.status(400).json({
      success:false,
      message:'order getting failed'
    })
  }
}

const getAllOrder= async ( req, res)=>{
  try{
    const order = await orders.aggregate([
      {
        $match: {
          cancelStatus: { $ne: true } 
        }
      },
      {
        $lookup: {
          from: 'shops', 
          localField: 'shopName', 
          foreignField: '_id', 
          as: 'shopdetails'
        }
      }
    ]);
    if(order) {
      res.json({
        success:true,
        message:'order getting successfully',
        data:order
      })
    }
  } 
  catch(err) {
    console.log(err);
    res.status(400).json({
      success:false,
      message:'order getting failed'
    })
  }
}

const getsingleorderdetails= async(req, res) =>{
  try{
    const id= new mongoose.Types.ObjectId(req.params.id)
    const singleOrderData= await orders.aggregate([
      {
        $match:{
          _id:id
        }
      }
      ,
      {
          $lookup:{
            from:'shops',
            localField:'shopName',
            foreignField:'_id',
            as:'shopdetails'
          }
      }
    ])
    if(singleOrderData) {
      res.json({
        success:true,
        message:'datafetched successfully',
        data:singleOrderData
      })
    }
  } 
  catch(err) {
    console.log(err);
    res.status(400).json({
      success:false,
      message:'orderdata fetching failed',
    })
  }
}

module.exports = { userlogin ,createOrder,getShops,getOrder,getAllOrder,getsingleorderdetails};
