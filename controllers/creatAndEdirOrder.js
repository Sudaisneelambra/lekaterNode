const orders = require('../models/order')

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
  
      console.log(filePath,'-----------');

      const orderdetails = await orders.findOne({_id:orderId})
  
      if( orderdetails) {
        orderdetails.shopName=shopName
        orderdetails.itemName=itemName
        orderdetails.fabricNameAndCode=fabricNameAndCode
        if(filePath){
           orderdetails.imageUrl=filePath
        }
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
      console.log(err)
      res.status(500).json({ error: "Internal Server Error" });
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
  module.exports = {
    editOrder,
    createOrder
  };