const mongoose=require('mongoose');

const Schema= new mongoose.Schema({
    pid:String,
    pname:String,
    totalprice:Number,
    odate:Number
});
module.exports=mongoose.model('order',Schema);