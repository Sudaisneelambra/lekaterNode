const orders =require('../models/order')

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

  // search by date pendingorders
const getsearchbydate = async(req, res) =>{
    try{
      const searchValue = req.query.searchValue;
      const searchDate =  new Date(searchValue)
      const page = req.query.page
      const skipValue =(page-1)*10
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
  
  module.exports = {
    allPendingOrders,
    getsearchbydate,
    getsearchpendingorder
  };
  