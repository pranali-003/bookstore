const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require('../models/book');
const { authenticationToken } = require("./userAuth");

// add book --admin

router.post("/add-book", authenticationToken, async (req, res) => {
  try {
    // to check that the user is admin
    const {id} = req.headers;
    const user  = await User.findById(id);
    if(user.role !== "admin"){
        return res.status(400).json({ message: "Access Blocked" });
    }
    const book = new Book({
        url : req.body.url,
        title : req.body.title,
        author: req.body.author,
        price : req.body.price,
        desc : req.body.desc,
        language : req.body.language,
    })
    await book.save();
    res.status(200).json({message:"Book Added Successfully!"})
  } catch (error) {
    res.status(500).json({ message: " Server Error" , error });
  }
});


// update book

router.put("/update-book", authenticationToken, async (req, res) => {
    try {
      // to check that the user is admin
      const {bookid} = req.headers;
      await Book.findByIdAndUpdate(bookid,{
        url : req.body.url,
        title : req.body.title,
        author: req.body.author,
        price : req.body.price,
        desc : req.body.desc,
        language : req.body.language,
      });
      res.status(200).json({message:"Book updated Successfully!"});
    } catch (error) {
      res.status(500).json({ message: " Server Error" , error });
    }
});

//delete book

router.delete("/delete-book", authenticationToken, async (req, res) => {
    try {
      // to check that the user is admin
      const {bookid} = req.headers;
      await Book.findByIdAndDelete(bookid);
      res.status(200).json({message:"Book deleted Successfully!"});
    } catch (error) {
      res.status(500).json({ message: " Server Error" , error });
    }
});


// get-all-books

router.get("/get-all-books", authenticationToken, async(req,res)=>{
    try{
        const books = await Book.find().sort({createdAt : -1});
        return res.json({
            status : "Success",
            data : books,
        })

    }catch(error){
        return res.status(500).json({message:"An error Occurred."})
    }
})

// get recent 4 books

router.get("/get-recent-books", authenticationToken, async(req,res)=>{
    try{
        const books = await Book.find().sort({createdAt : -1}).limit(4);
        return res.json({
            status : "Success",
            data : books,
        })

    }catch(error){
        return res.status(500).json({message:"An error Occurred."})
    }
})


// get book by id

router.get("/get-book-by-id/:id", authenticationToken, async(req,res)=>{
  try{
    const {id} =req.params;
    const book = await Book.findById(id);
    return res.json({
            status : "Success",
            data : book,
          });

    }catch(error){
      return res.status(500).json({message:"An error Occurred."})
    }
})


module.exports = router;