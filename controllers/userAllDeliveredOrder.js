const orders = require('../models/order')
const mongoose = require("mongoose");

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


  module.exports = {
    orderdeliveried,
    allDeliveredOrders,
    getsearchdeliveredorder
  };