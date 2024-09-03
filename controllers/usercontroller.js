const users = require("../models/userlogin");
const orders = require("../models/order");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shopsModel = require("../models/shops");
const sercretKey = process.env.JWT_SECRETKEY;
const mongoose = require("mongoose");


// user login
const userlogin = async (req, res) => {
  try {
    const { password, email } = req.body;
    const mailexist = await users.findOne({ email });
    if (mailexist) {
      const passworddecode = await bcrypt.compare(password, mailexist.password);
      if (passworddecode) {
        if (!mailexist.blockStatus) {
          const token = jwt.sign(
            {
              name: mailexist.username,
              email: mailexist.email,
              phonenumber: mailexist.phoneNumber,
              type: mailexist.isAdmin,
            },
            sercretKey,
            { expiresIn: "1h" }
          );
          res.json({
            success: true,
            token: token,
            message: "login successfull",
          });
        } else {
          res.json({
            success: false,
            message: "admin blocked user access",
          });
        }
      } else {
        res.json({
          success: false,
          message: "password incorrect",
        });
      }
    } else {
      res.json({
        success: false,
        message: "User Not Found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Userdata fetching failed",
    });
  }
};

// shops getting for dropdown
const getShops = async (req, res) => {
  try { 
    const shops = await shopsModel.find({});
    res.json({
      success: true,
      message: "shops getting successfully",
      data: shops,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "shops getting failed",
    });
  }
};


// get orders or latest order
const getOrder = async (req, res) => {
  try {
    
    const order = await orders.aggregate([
      {
        $match: {
          cancelStatus: false,
          orderDeliveriedStatus: false,
        },
      },
      {
        $lookup: {
          from: "shops",
          localField: "shopName",
          foreignField: "_id",
          as: "shopdetails",
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 10 } 
    ]);
    if (order) {
      res.json({
        success: true,
        message: "order getting successfully",
        data: order,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "order getting failed",
    });
  }
};

// get single orders
const getsingleorderdetails = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const singleOrderData = await orders.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $lookup: {
          from: "shops",
          localField: "shopName",
          foreignField: "_id",
          as: "shopdetails",
        },
      },
    ]);
    if (singleOrderData) {
      res.json({
        success: true,
        message: "datafetched successfully",
        data: singleOrderData,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "orderdata fetching failed",
    });
  }
};

// cancel status changes
const cancelorder = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const singleOrder = await orders.findOne({ _id: id });
    if (singleOrder) {
      singleOrder.cancelStatus = true;
      await singleOrder.save();
      res.json({
        success: true,
        message: "order cancelled successfully",
      });
    } else {
      res.json({
        success: false,
        message: "order cancelation failed",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "order cancelation  failed",
    });
  }
};


// all cancel order getting
const allcancelorder = async (req, res) => {
  try {
    const order = await orders.aggregate([
      {
        $match: {
          cancelStatus: true,
        },
      },
      {
        $lookup: {
          from: "shops",
          localField: "shopName",
          foreignField: "_id",
          as: "shopdetails",
        },
      },
    ]);
    if (order) {
      res.json({
        success: true,
        message: "order cancelation successfully",
        data: order,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "order cancellation failed",
    });
  }
};


// order details get
const orderdetail = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    // const singleOrder = await orders.findOne({ _id: id });
    const withShopName= await orders.aggregate([
      {
        $match:{
          _id:id
        }
      },
      {
        $lookup:{
          from:"shops",
          localField:"shopName",
          foreignField:"_id",
          as:"shopdetails"
        }
      }
    ])
    
    if (withShopName) {
      res.json({
        success: true,
        message: "order details getted successfully",
        data:withShopName[0]
      });
    } else {
      res.json({
        success: false,
        message: "order details getted failed",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "order details getting failed",
    });
  }
};




module.exports = {
  userlogin,
  getShops,
  getOrder,
  getsingleorderdetails,
  cancelorder,
  allcancelorder,
  orderdetail,
};
