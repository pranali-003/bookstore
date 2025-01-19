const router = require("express").Router();
const User = require("../models/user");
const Book = require('../models/book');
const jwt =  require("jsonwebtoken");
const { authenticationToken } = require("./userAuth");


// add book to favourite

router.put('/add-book-to-favourite', authenticationToken, async(req,res)=>{
    try{
        const {bookid,id} = req.headers;
        const userData = await User.findById(id); 
        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite){
            return res.status(200).json({message:"Book is already in favourites"});
        }
        // favourites is an array hence we push the new favourite book in the array
        await User.findByIdAndUpdate(id,{$push:{favourites : bookid}});
        return res.status(200).json({message:"Book added in favourites"});
    }catch(error){
        return res.status(500).json({message:"Internal Server Error"})
    }

})

// delete book from favourite

router.put('/remove-book-from-favourite', authenticationToken, async(req,res)=>{
    try{
        const {bookid,id} = req.headers;
        const userData = await User.findById(id); 
        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite){
            await User.findByIdAndUpdate(id,{$pull:{favourites : bookid}});
        }
        // favourites is an array hence we pull the favourite book out of the array
       
        return res.status(200).json({message:"Book removed from favourites"});
    }catch(error){
        return res.status(500).json({message:"Internal Server Error"})
    }

});

// get favourite book of a particular user 

router.get('/get-favourite-books', authenticationToken, async(req,res)=>{
    try{
        const {id} = req.headers;
        // populate is used to gather the whole data from an another referred data model. if populate is not used only the id of the book will be returned
        const userData = await User.findById(id).populate("favourites"); 
        const favouriteBooks = userData.favourites;
        return res.json({
            status:"Success",
            data: favouriteBooks,
        });
    }catch(error){
        return res.status(500).json({message:"Internal Server Error"})
    }

});






module.exports = router;