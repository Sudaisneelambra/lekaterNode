const express =require('express')
require('dotenv').config()
const mongoose =require('mongoose')
const PORT= process.env.PORT || 3000
const DB_URL=process.env.DB_URL
const app = express()
app.use(express.json())

const userRoutes = require('./routes/userroutes')
const adminRoutes =require('./routes/adminroutes')

app.use('/user',userRoutes)
app.use('/admin',adminRoutes)



// database connnection
mongoose.connect(DB_URL)
.then(()=>{
    console.log(`database connected successfully`);
    app.listen(PORT, ()=>{
        console.log(`server running on port ${PORT}`);
    })
})
.catch((err)=>{
    console.log(err);
    console.log(`Database connection failed`);
})

