const router = require("express").Router();
const User  = require('../models/user')
const bcrypt  = require("bcryptjs");
const jwt =  require("jsonwebtoken");
const authenticationToken = require("./userAuth")
//signup


router.post("/sign-in", async(req,res)=>{
    try{
        const {username, password} = req.body;
        const existingUser  =  await User.findOne({username});
        if(!existingUser){
            res.status(400).json({message:"Invalid Credentials"})
        }
        // for validating password with the hashed password in the db
        await bcrypt.compare(password, existingUser.password,(err,data)=>{
            if(data){
                const authClaims = [
                    {name:existingUser.username},
                    {role:existingUser.role},
                ]
                const token = jwt.sign({authClaims},"bookStore123",{expiresIn:"30d"})
                res.status(200).json({
                    id: existingUser._id,
                    role:existingUser.role,
                    token:token
                });
            }else{
                res.status(400).json({message:"Invalid Credentials"});
            }
        })
    }catch(error){
        return res.status(500).json({message:"error occurred"});
    }
})
router.post("/sign-up", async(req,res)=>{
    try{
        const {username,password,email,address} = req.body;
        // check usrname length more than 4
        if(username.length < 4){
            return res.status(400).json({message:"username length should be more than 3"})
        }
        if(!username || !email){
            return res.status(400).json({message:"username and email required"})
        }
        // check username already exists
        const existingUsername = await User.findOne({username: username});
        if(existingUsername){
            return res.status(400).json({message:"Username already exists"});
        }
         // check email already exists
         const existingEmail = await User.findOne({email: email});
         if(existingEmail){
            return res.status(400).json({message:"Email already exists"});
         }
          // check password length > 5 
        
        if(password.length <= 5){
            return res.status(400).json({message:"Password should be greate then 5 characters"});
        }
        const hashPass  = await  bcrypt.hash(password, 10);
        const newUser = new User({
            username:username,
            password :hashPass,
            address:address,
            email: email
        });
        await newUser.save();
        return res.status(200).json({message:"SignUp Successful"})
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal server Error"});
    }
})

// router.get("/get-user-info", authenticationToken, async(req,res)=>{
//     try{
//         const {id} =req.headers;
//         const data = await User.findById(id);
//         return res.status(200).json(data);
//     }catch(error){
//         console.log(error);
//         return res.status(500).json({message: "Internal server Error"});
//     }
// })



module.exports = router;

