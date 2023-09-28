const express=require('express');
const users = require('../models/users');
const router=express.Router();
// const ObjectID = require("mongodb").ObjectId;

//setting credintial
const credential={
    email:"admin1@gmail.com",
    password:123,
}
//login page route
router.get('/', (req, res) => {
  if (req.session.userlogged) {
      res.redirect("/home");
  }else if(req.session.adminlogged){
    res.redirect("/adminPage")
     } else {
      res.render("base", { title: "Login Page", err: false });
  }
});

//user login

router.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    const connects=await users.findOne({email:email,password:password});
    if(connects){
        console.log("Successful");
        req.session.user=req.body.email;
        req.session.userlogged=true;
        res.render("home", { title: "Login Page", err: false });
    }else{
        console.log("Failed");
        res.render("base", { title: "Login Page", err: "Invalid user Name or Password" }); 
    }
})
//Route user login page

router.get("/tologin",(req,res)=>{
    res.redirect("/")
})

// admin page route

router.get("/adminlogin",(req,res)=>{
  if(req.session.adminlogged){
 res.redirect("/adminPage")
  }else{
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.render("admin",{title:"Admin log page"})}
})

//admin loging

router.post("/adminlog", (req, res) => {
    if (
      req.body.email == credential.email &&
      req.body.password == credential.password
      ) {
          req.session.user = req.body.email;
          req.session.adminlogged = true;
      res.redirect("/adminPage");
    } else {
      // res.render("admin", { err: "Invalid Username or Password" });
      res.redirect("/adminlogin")
    }
  });
  
  //adding datas to the admin home page
  
  router.get("/adminPage", async (req, res) => {
      if (req.session.adminlogged) {
          var i = 0;
          const useData = await users.find();
          
          res.render("adminPage", { title: "user details", useData, i });
        } else {
            res.redirect("/adminPage");
        }
  });
  //base to signup
        router.get("/signup",(req,res)=>{
          if(req.session.adminlogged){
            res.redirect('/adminPage')
          }else{
            if(req.session.userlogged){
              res.redirect('/home')
            }else{
              res.render('signup',{title:"sign up page"})
            }
          }
        })
 //signing to login
        router.get("/tologin",(req,res)=>{
          if(req.session.adminlogged){
            res.redirect('/adminPage')
          }else{
            if(req.session.userlogged){
              res.redirect('/home')
            }else{
            res.render("base",{title:"Login Page"})
            }
          }
        })

  //Sign Up Page

router.post("/signupto", async (req, res) => {
    const { name, email, password } = req.body;
  
    const use = await users.create(req.body);
  
    req.session.user = email;
    req.session.userlogged = true;
    res.redirect("/home");
  });

  router.get('/adduser', (req, res) => {
    res.render('adduser', { title: 'Add User' });
  });
  

  //insertion of users

router.post("/insert", async (req, res) => {
    const { name, email, password } = req.body;
  
    const newuser = await users.create(req.body);
    res.redirect("/adminPage");
  });

//search user

router.post("/search", async (req, res) => {
    var i = 0;
    const data = req.body;
    console.log(data);
    let useData = await users.find({
      name: { $regex: "^" + data.search, $options: "i" },
    });
    console.log(`Search Data ${useData} `);
    res.render("adminPage", { title: "Home", user: req.session.user, useData, i });
  });
  
  //home routing

  router.get('/home', (req, res) => {
    if (req.session.userlogged) {
        res.render("home", { title: "Home Page", use: req.session.user });
    } else {
        res.redirect("/");
    }
});

  router.get("/add",(req,res)=>{
        res.redirect("/adduser")
  })

  

  //deletion
  router.get("/delete/:id",async(req,res)=>{
    const id=req.params.id;
    const deleted=await users.deleteOne({_id:id})
    res.redirect("/adminPage");
  })
 
  //edit

  router.get("/edit/:id",async(req,res)=>{
    const id=req.params.id;
    const dataone = await users.findOne({_id: id});
    res.render("userdata",{title:"User Data",dataone})
  });

  //add user

  router.post("/update/:id",async(req,res)=>{
    let newData=req.body;
    let id=req.params.id
    await users.updateOne(
        {_id:id},
        {$set:{
            name:newData.name,
            email:newData.email
        }}
    )
    res.redirect("/adminPage");
  })

  //signout 

  router.get("/signout", (req, res) => {
    console.log('signout')
    req.session.destroy();
    res.redirect("/");
  });

  router.get("/adminPage",(req,res)=>{
    res.render("adminPage",{title:"home",table})
  })


module.exports=router;