const mongoose=require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
   console.log("connected..");
})
.catch((err)=>{
   console.log("not connected",err.message);
})

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
       }
})

const User = mongoose.model('User', userSchema);

module.exports = User; 