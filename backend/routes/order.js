const express = require('express');
const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const Order = require('../models/order');
const { authenticationToken } = require("./userAuth");


// place order

router.post("/place-order", authenticationToken,async(req,res)=>{
    try{
        const {id} = req.headers;
        const {order} = req.body;
        for(const orderData of order){
            const newOrder  = new Order({user : id, book: orderData._id});
            const orderDataFromDb = await newOrder.save();

            // saving data in user model
            await User.findByIdAndUpdate(id,{
                $push : {order:orderDataFromDb._id},

            });
            //clearing cart after successful order
            await User.findByIdAndUpdate(id,{
                $pull : {cart: orderData._id}
                
            });
        }
        return res.json({
            status :"Success",
            message: "Order Placed Successfully",
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
});

// get order history of particular user 
router.get("/get-order-history", authenticationToken, async(req,res)=>{
    try{

        const {id} =req.headers;
        const userData = await User.findById(id).populate({
            path:"orders",
            populate:{path:"book"},
        });
        const orderData = userData.orders.reverse();
        return res.json({
            status : "Success",
            data : orderData,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
})

// get-all-orders --admin

router.get("/get-all-orders", authenticationToken, async(req,res)=>{
    try{
        const userData = await Order.find()
        .populate({
            path :"book"
        }).populate({
            path :"user",
        })
        .sort({createdAt:-1});
        return res.json({
            status : "Success",
            data : userData,
        })
    }catch(error){
        return res.status(500).json({message:"Internal Server Error"});
    }
})


// order update by admin


router.put("/update-order", authenticationToken, async(req,res)=>{
    try{
        // id = order-id
        const {id} = req.params;
        await Order.findByIdAndUpdate(id, {
            status : req.body.status
        });
        return res.json({
            status : "Success",
            message :"Status Updated Successfully"
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
})

module.exports = router;