const express = require('express');
const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const jwt =  require("jsonwebtoken");
const { authenticationToken } = require("./userAuth");

// add to cart

router.put("/add-to-cart", authenticationToken, async (req, res) => {
    console.log("inside function");
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookInCart = userData.cart.includes(bookid);
    if (isBookInCart) {
      return res.json({
        status :"Success",
        message: "Book is already in cart" });
    }
    // cart is an array hence we push the new favourite book in the cart array
    await User.findByIdAndUpdate(id,{ 
        $push: { cart: bookid } ,
    });
    return res.json({ 
        status:"Success",
        message: "Book added to cart",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// delete book from cart

router.put('/remove-book-from-cart', authenticationToken, async(req,res)=>{
    try{
        const {bookid,id} = req.headers;
        const userData = await User.findById(id); 
        const isBookInCart = userData.favourites.includes(bookid);
        if(isBookInCart){
            await User.findByIdAndUpdate(id,{$pull:{cart : bookid}});
        }
        // favourites is an array hence we pull the favourite book out of the array
       
        return res.status(200).json({message:"Book removed from cart"});
    }catch(error){
        return res.status(500).json({message:"Internal Server Error"})
    }

});


// get user cart of a particular user

router.get('/get-user-cart', authenticationToken, async(req,res)=>{
    try{
        const {id} = req.headers;
        // populate is used to gather the whole data from an another referred data model. if populate is not used only the id of the book will be returned
        const userData = await User.findById(id).populate("cart"); 
        // newest added book will appear first if reversed
        const booksInCart = userData.cart.reverse();
        if(booksInCart.length === 0 ){
            return res.status(200).json({message:"Your cart is Empty"});
        }
        return res.json({
            status:"Success",
            data: booksInCart,
        });
    }catch(error){
        return res.status(500).json({message:"Internal Server Error"})
    }

});


module.exports = router;
