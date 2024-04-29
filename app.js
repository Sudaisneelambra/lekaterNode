const express =require('express')
require('dotenv').config()
const mongoose =require('mongoose')
const PORT= process.env.PORT || 3000
const DB_URL=process.env.DB_URL
const app = express()
app.use(express.json())

const userroutes = require('./routes/userroutes')

app.use('/user',userroutes)



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

