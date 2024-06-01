const orders = require('../models/order')

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
  

  module.exports = {
    getAllOrder,
    getsearchallorder
  };