const mongoose = require('mongoose');
const walletHistory = new mongoose.Schema({
  id:Number,
  date:Date,type:String,
  address:String,
  bnb_balance:Number,
  usdc_balance:Number,
  usdt_balance:Number,
  busd_balance:Number
});
module.exports = mongoose.model('walletHistory',walletHistory); 