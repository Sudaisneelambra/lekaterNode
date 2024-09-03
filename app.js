const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;
const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userroutes')
const adminRoutes =require('./routes/adminroutes')

app.use('/user',userRoutes)
app.use('/admin',adminRoutes)

const userroutes = require("./routes/userroutes");

app.use("/user", userroutes);

// database connnection
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log(`database connected successfully`);
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT} ...`);
    });
  })
  .catch((err) => {
    console.log(err);
    console.log(`Database connection failed`);
  });
