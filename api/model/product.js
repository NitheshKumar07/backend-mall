const mongoose = require('mongoose');

productSchema = mongoose.Schema({
  _id:mongoose.Schema.Types.ObjectId,
  title:String,
  ctgry:{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' },  // Link to Category model..........//String,
  price:Number,
  realprice:Number, //.........
  discount:Number, //.......
  colour:String, //......
  description:String,
  productCode:String,
  photo:String,
  brandName:String
})

module.exports = mongoose.model('product',productSchema);

// chatgpt....................................................................................................................................................................
// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
//   title: { 
//     type: String, 
//     required: true 
//   }, // Title is required
//   ctgry: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Category',
//     required: true 
//   }, // Category ID is required and references the 'Category' model
//   price: { 
//     type: Number, 
//     required: true 
//   }, // Price is required and should be a number
//   realPrice: { 
//     type: Number, 
//     default: 0 
//   }, // realPrice, defaulting to 0 if not provided
//   discount: { 
//     type: Number, 
//     default: 0 
//   }, // Discount percentage, defaulting to 0 if not provided
//   colour: String, // Colour of the product (optional)
//   description: String, // Description of the product
//   productCode: { 
//     type: String, 
//     unique: true 
//   }, // Unique product code
//   photo: String // URL of the photo
// }, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// module.exports = mongoose.model('Product', productSchema);
