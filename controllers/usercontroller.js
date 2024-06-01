const users = require("../models/userlogin");
const orders = require("../models/order");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shopsModel = require("../models/shops");
const sercretKey = process.env.JWT_SECRETKEY;
const mongoose = require("mongoose");
const order = require("../models/order");


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


// create order
const createOrder = async (req, res) => {
  try {
    const {
      shopName,
      itemName,
      fabricNameAndCode,
      itemDescription,
      orderReceivedDate,
      expectingDeliveryDate,
    } = req.body;

    const filePath = req?.file?.location;
    const username = req?.tokens?.name;

    const neworder = new orders({
      shopName,
      itemName,
      fabricNameAndCode,
      imageUrl: filePath,
      itemDescription,
      orderReceivedDate,
      expectingDeliveryDate,
      orderRecivedBy: username,
      editedperson:null,
    });

    await neworder.save();
    res.json({
      success: true,
      message: "Order Created Successfully",
      data: neworder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
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


// get all orders 
const getAllOrder = async (req, res) => {
  try {
    const condition = { cancelStatus: false };
    const orderslength = await orders.countDocuments(condition);
    const {skip} =req.body
    const skipvalue =(skip-1)*10
    const order = await orders.aggregate([
      {
        $match: {
          cancelStatus: { $ne: true },
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
      {
        $sort:{orderReceivedDate:-1}
      },
      { $skip: skipvalue },
      { $limit: 10 } 
    ]);
    if (order) {
      res.json({
        success: true,
        message: "order getting successfully",
        data: order,
        searchedlength:orderslength
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


// orderdelivered status change
const orderdeliveried = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const singleOrder = await orders.findOne({ _id: id });
    if (singleOrder) {
      singleOrder.orderDeliveriedStatus = true;
      singleOrder.DeliveredDate = new Date();
      await singleOrder.save();
      res.json({
        success: true,
        message: "order Delivered successfully",
      });
    } else {
      res.json({
        success: false,
        message: "order Delivered failed",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "order deliverying status failed",
    });
  }
};

// all deliveried order
const allDeliveredOrders = async (req, res) => {
  try {
    const {page} = req.body
    const skipvalue =(page-1)*10
    const condition ={orderDeliveriedStatus: true}
    const orderslength = await orders.countDocuments(condition);
    const order = await orders.aggregate([
      {
        $match: {
          orderDeliveriedStatus: true,
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
      {
        $sort: { DeliveredDate: -1 }
      },
      { $skip: skipvalue },
      { $limit: 10 }
    ]);
    if (order) {
      res.json({
        success: true,
        message: "all delivered order getting successfully",
        data: order,
        searchedlength:orderslength
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


// all pending orders
const allPendingOrders = async (req, res) => {
  try {
    const {page} = req.body
    const skipvalue =(page-1)*10
    const condition ={orderDeliveriedStatus: false,cancelStatus: false,}
    const orderslength = await orders.countDocuments(condition);
    const order = await orders.aggregate([
      {
        $match: {
          orderDeliveriedStatus: false,
          cancelStatus: false,
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
      {
        $sort: { expectingDeliveryDate: 1 }
      },
      { $skip: skipvalue },
      { $limit: 10 } 
    ]);
    if (order) {
      res.json({
        success: true,
        message: "all pending order getting successfully",
        data: order,
        searchedlength:orderslength
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
    const singleOrder = await orders.findOne({ _id: id });
    if (singleOrder) {
      res.json({
        success: true,
        message: "order details getted successfully",
        data:singleOrder
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


// edit order
const editOrder = async (req, res) => {
  try {
    const {
      shopName,
      itemName,
      fabricNameAndCode,
      itemDescription,
      orderReceivedDate,
      expectingDeliveryDate,
      orderId
    } = req.body;

    const filePath = req?.file?.location;
    const username = req?.tokens?.name;

    const orderdetails = await orders.findOne({_id:orderId})

    if( orderdetails) {
      orderdetails.shopName=shopName
      orderdetails.itemName=itemName
      orderdetails.fabricNameAndCode=fabricNameAndCode
      orderdetails.imageUrl=filePath
      orderdetails.itemDescription=itemDescription
      orderdetails.orderReceivedDate=orderReceivedDate
      orderdetails.expectingDeliveryDate=expectingDeliveryDate
      orderdetails.editedperson=username
      orderdetails.editstatus=true
      orderdetails.EditDate= new Date()

      const saved = await orderdetails.save()
      if(saved){
        res.json({
          success: true,
          message: "Order edited Successfully",
          data: orderdetails,
        });
      }
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// get all ordersearch
const getsearchallorder= async(req, res) =>{
  try {
    const searchValue = req.query.searchValue;
    const page = req.query.page;
    const skipvalue =(page-1)*10
    const ord = await orders.aggregate([
      {
        $lookup: {
          from: "shops",
          localField: "shopName",
          foreignField: "_id",
          as: "shopdetails",
        },
      },
      {
        $match: {
          "shopdetails.shopName": { $regex: searchValue, $options: 'i' }
        }
      },
      {
        $count: "totalCount"
      }
    ]);

    const orde = await orders.aggregate([
      {
        $lookup: {
          from: "shops",
          localField: "shopName",
          foreignField: "_id",
          as: "shopdetails",
        },
      },
      {
        $match: {
          "shopdetails.shopName": { $regex: searchValue, $options: 'i' }
        }
      },
      {
        $sort:{orderReceivedDate:-1}
      },
      { $skip: skipvalue },
      { $limit: 10 } 
    ]);

    if(orde) {
      res.json({
        success:true,
        message:"successfully getted",
        searchedlength:ord[0]?.totalCount,
        data:orde,
      })
    }
  }
  catch(err) {
    res.json({
      success:false,
      message:'getting failed'
    })
  }
}

// get all pending orders search
const getsearchpendingorder= async(req, res) =>{
  try {
    const searchValue = req.query.searchValue;
    const page = req.query.page;
    const skipvalue =(page-1)*10

    const ord = await orders.aggregate([
      {
        $match: {orderDeliveriedStatus: false,cancelStatus: false,}
      },
      {
        $lookup: {
          from: "shops",
          localField: "shopName",
          foreignField: "_id",
          as: "shopdetails",
        },
      },
      {
        $match: {
          "shopdetails.shopName": { $regex: searchValue, $options: 'i' }
        }
      },
      {
        $count: "totalCount"
      }
    ]);

    const orde = await orders.aggregate([
      {
        $match: {orderDeliveriedStatus: false,cancelStatus: false,}
      },
      {
        $lookup: {
          from: "shops",
          localField: "shopName",
          foreignField: "_id",
          as: "shopdetails",
        },
      },
      {
        $match: {
          "shopdetails.shopName": { $regex: searchValue, $options: 'i' }
        }
      },
      {
        $sort:{expectingDeliveryDate:1}
      },
      { $skip: skipvalue },
      { $limit: 10 } 
    ]);
    if(orde) {
      res.json({
        success:true,
        message:"successfully getted",
        searchedlength:ord[0]?.totalCount,
        data:orde,
      })
    }
  }
  catch(err) {
    res.json({
      success:false,
      message:'getting failed'
    })
  }
}

// get all delivered orders search
const getsearchdeliveredorder= async(req, res) =>{
  try {
    const searchValue = req.query.searchValue;
    const page = req.query.page;
    const skipvalue =(page-1)*10

    const ord = await orders.aggregate([
      {
        $match: {orderDeliveriedStatus: true}
      },
      {
        $lookup: {
          from: "shops",
          localField: "shopName",
          foreignField: "_id",
          as: "shopdetails",
        },
      },
      {
        $match: {
          "shopdetails.shopName": { $regex: searchValue, $options: 'i' }
        }
      },
      {
        $count: "totalCount"
      }
    ]);

    const orde = await orders.aggregate([
      {
        $match: {orderDeliveriedStatus: true}
      },
      {
        $lookup: {
          from: "shops",
          localField: "shopName",
          foreignField: "_id",
          as: "shopdetails",
        },
      },
      {
        $match: {
          "shopdetails.shopName": { $regex: searchValue, $options: 'i' }
        }
      },
      {
        $sort:{DeliveredDate:-1}
      },
      { $skip: skipvalue },
      { $limit: 10 } 
    ]);
    if(orde) {
      res.json({
        success:true,
        message:"successfully getted",
        searchedlength:ord[0]?.totalCount,
        data:orde,
      })
    }
  }
  catch(err) {
    res.json({
      success:false,
      message:'getting failed'
    })
  }
}

const getsearchbydate = async(req, res) =>{
  try{
    const searchValue = req.query.searchValue;
    const searchDate =  new Date(searchValue)
    const page = req.query.page
    const skipValue =(page-1)*10
    console.log(searchDate);
    console.log(skipValue);
    const ord = await orders.aggregate([
      {
        $match: {
          $and: [
            { expectingDeliveryDate: searchDate },
            { orderDeliveriedStatus: false }
          ]
        }
      },
      {
        $lookup: {
          from: "shops",
          localField: "shopName",
          foreignField: "_id",
          as: "shopdetails",
        },
      },
      {
        $count:'totalCount'
      }
    ])

    const orde = await orders.aggregate([
      {
        $match: {
          $and: [
            { expectingDeliveryDate: searchDate },
            { orderDeliveriedStatus: false }
          ]
        }
      },
      {
        $lookup: {
          from: "shops",
          localField: "shopName",
          foreignField: "_id",
          as: "shopdetails",
        },
      },
      { $skip: skipValue },
      { $limit: 10 } 
    ])

    if(orde){
      res.json({
        success:true,
        message:"successfully getted",
        data:orde,
        searchedlength:ord[0]?.totalCount
        })
    } else {
      res.json({
        success:false,
        message:"no data found"
        })
    }
  }
  catch(err){
    res.json({
      success:false,
      message:"getting failed"
      })
  }
}

module.exports = {
  userlogin,
  createOrder,
  getShops,
  getOrder,
  getAllOrder,
  getsingleorderdetails,
  orderdeliveried,
  allDeliveredOrders,
  allPendingOrders,
  cancelorder,
  allcancelorder,
  orderdetail,
  editOrder,
  getsearchallorder,
  getsearchpendingorder,
  getsearchdeliveredorder,
  getsearchbydate
};
