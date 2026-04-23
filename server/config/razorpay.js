// const Razorpay = require("razorpay");

// exports.instance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY,
//   key_secret: process.env.RAZORPAY_SECRET,
// });
const Razorpay = require("razorpay");

let instance = null;

if (
  process.env.RAZORPAY_KEY &&
  process.env.RAZORPAY_SECRET &&
  process.env.RAZORPAY_KEY !== "your_razorpay_key"
) {
  instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });
}

module.exports = { instance };