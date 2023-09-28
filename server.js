const express=require('express')
const path=require('path')
const session=require('express-session')
const mongoose=require("mongoose")
const { log } = require('console')
const nocache=require('nocache')
const app=express()

app.use(nocache());


require('dotenv').config()
const PORT=process.env.PORT||5000;




app.set('view engine',"ejs")
//  app.set('views', path.join(__dirname, 'views')); 






    
    //middle ware
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.use(session({
      secret:'my secret key',
      saveUninitialized:true,
      resave:false,
    }))
    //style
    app.use('/static',express.static(path.join(__dirname,'global')))

 //route
 app.use("/",require("./routes/routes"))




app.listen(PORT, () => {
    console.log(`server start running http://localhost:${PORT}`)
});






