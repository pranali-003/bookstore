const express =  require("express");
const app = express();
require("dotenv").config();
require('./conn/conn')
const user =  require('./routes/user');
const book  = require('./routes/books');
const favourite  = require('./routes/favourite');
const cart = require('./routes/cart');
const order  =require('./routes/order');
// creating Port
app.use(express.json());
app.use("/api/v1",user);
app.use("/api/v1",book);
app.use("/api/v1",favourite);
app.use("/api/v1/",cart);
app.use("/api/v1",order);
app.listen(process.env.PORT,()=>{
    console.log(`Server started at ${process.env.PORT}`);
});

app.get("/",(req,res)=>{
    res.send("hello backend");
})