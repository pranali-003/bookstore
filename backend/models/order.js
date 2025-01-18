const mongoose =require("mongoose");

const order = new Mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : "user",
    },
    book : {
        type : mongoose.Types.ObjectId,
        ref : "books",
    },
    status : {
        type : String,
        default :"order Placed",
        enum : ["Order Placed", "Out for Delivery, Delivered, Cancelled"]
    },
},
{timestamps  :true }
);
module.exports = mongoose.model("order",order);