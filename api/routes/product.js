const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../model/product');
const cloudinary = require('cloudinary').v2;
const checkAuth = require('../middleware/check-auth')

cloudinary.config({
  cloud_name:'',
  api_key:'',
  api_secret:''
});


// get all products
router.get('/category/:ctgryId',(req,res,next)=>{
  Product.find({ ctgry: req.params.ctgryId })
  .select('title price realprice discount colour productCode description photo brandName ctgry')
  .then(result=>{
    res.status(200).json({
      product:result
    })
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    })
  })
});
//get single product by id
router.get('/:id',(req,res,next)=>{
  const _id = req.params.id;
  Product.findById(_id)
  .select('_id title realprice discount colour productCode description price ctgry photo brandName')
  .then(result=>{
    // console.log(result)
    res.status(200).json({
      product:result
    })
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    })
  })
})

// return data by category
router.get('/cat/:ctgry',(req,res,next)=>{
  Product.find({ctgry:req.params.ctgry})
  .then(result=>{
    res.status(200).json({
      product:result
    })
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    })
  })
})
// save product
router.post('/',(req,res,next)=>{
  console.log(req);
  console.log(req.files);
  const file = req.files.photo;
  cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
    console.log(result);
    myproduct = new Product({
      _id:new mongoose.Types.ObjectId,
      title:req.body.title,
      ctgry:req.body.ctgry,
      price:req.body.price,
      realprice: req.body.realprice,  // realprice 
      discount: req.body.discount,  // Discount percentage
      description:req.body.description, //description
      colour:req.body.colour, //colour
      productCode:req.body.productCode,
      photo:result.url,
      brandName:req.body.brandName //brand
    });
    myproduct.save()
    .then(result=>{
      console.log(result);
      res.status(200).json({
        new_product:result
      })
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({
        error:err
      })
    })
  });

})

// update
router.put('/:id',(req,res,next)=>{
  console.log(req.params.id);
  const file = req.files.photo;
  console.log(file);
  cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
    console.log(result);
    Product.findOneAndUpdate({_id:req.params.id},{
      $set:{
        title:req.body.title,
        ctgry:req.body.ctgry,
        price:req.body.price,
        realprice: req.body.realprice,  // realPrice
        discount: req.body.discount,  // Discount percentage
        description:req.body.description, //description
        colour:req.body.colour, //colour
        productCode:req.body.productCode,
        photo:result.url,
        brandName:req.body.brandName //brand
      }
    })
    .then(result=>{
      res.status(200).json({
        updated_product:result
      })
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({
        error:err
      })
    })
  })

})

// get last 6 project 
router.get('/data/recent',(req,res,next)=>{
  Product.find().sort({$natural: -1 }).limit(6)
  .then(result=>{
    res.status(200).json({
      product:result
    })
  })
})


router.delete('/:productId',(req,res,next)=>{

  Product.remove({_id:req.params.productId})
  .then(result=>{
    res.status(200).json({
      message:'product has been deleted',
      result:result
    })
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    })
  })

})


module.exports = router;


// chatgpt...............................................................................................................................................................
// const express = require('express');
// const mongoose = require('mongoose');
// const router = express.Router();
// const Product = require('../model/product');
// const cloudinary = require('cloudinary').v2;
// const checkAuth = require('../middleware/check-auth');

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: '', // Add your cloudinary cloud_name
//   api_key: '', // Add your cloudinary API key
//   api_secret: '' // Add your cloudinary API secret
// });

// // Get all products
// router.get('/', (req, res, next) => {
//   Product.find()
//     .populate('ctgry', 'name') // Populate category name
//     .select('_id title price realPrice discount colour productCode description ctgry photo')
//     .then(result => {
//       res.status(200).json({
//         product: result
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

// // Get single product by ID
// router.get('/:id', (req, res, next) => {
//   const _id = req.params.id;
//   Product.findById(_id)
//     .populate('ctgry', 'name') // Populate category name
//     .select('_id title price realPrice discount colour productCode description ctgry photo')
//     .then(result => {
//       res.status(200).json({
//         product: result
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

// // Get products by category
// router.get('/cat/:ctgry', (req, res, next) => {
//   const ctgry = req.params.ctgry;
//   Product.find({ ctgry })
//     .populate('ctgry', 'name') // Populate category name
//     .select('_id title price realPrice discount colour productCode description ctgry photo')
//     .then(result => {
//       res.status(200).json({
//         product: result
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

// // Save product
// router.post('/', checkAuth, (req, res, next) => {
//   const file = req.files.photo;
//   cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err });
//     }
//     const myProduct = new Product({
//       _id: new mongoose.Types.ObjectId(),
//       title: req.body.title,
//       ctgry: req.body.ctgry,
//       price: req.body.price,
//       realPrice: req.body.realPrice,
//       discount: req.body.discount,
//       description: req.body.description,
//       colour: req.body.colour,
//       productCode: req.body.productCode,
//       photo: result.url
//     });
//     myProduct.save()
//       .then(result => {
//         res.status(200).json({
//           new_product: result
//         });
//       })
//       .catch(err => {
//         res.status(500).json({ error: err });
//       });
//   });
// });

// // Update product
// router.put('/:id', checkAuth, (req, res, next) => {
//   const file = req.files ? req.files.photo : null;
//   if (file) {
//     cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: err });
//       }
//       updateProduct(req, res, result.url);
//     });
//   } else {
//     updateProduct(req, res, null); // No new photo
//   }
// });

// function updateProduct(req, res, photoUrl) {
//   const updateFields = {
//     title: req.body.title,
//     ctgry: req.body.ctgry,
//     price: req.body.price,
//     realPrice: req.body.realPrice,
//     discount: req.body.discount,
//     description: req.body.description,
//     colour: req.body.colour,
//     productCode: req.body.productCode
//   };

//   if (photoUrl) {
//     updateFields.photo = photoUrl;
//   }

//   Product.findOneAndUpdate({ _id: req.params.id }, { $set: updateFields })
//     .then(result => {
//       res.status(200).json({
//         updated_product: result
//       });
//     })
//     .catch(err => {
//       res.status(500).json({ error: err });
//     });
// }

// // Get the last 6 products
// router.get('/data/recent', (req, res, next) => {
//   Product.find().sort({ $natural: -1 }).limit(6)
//     .populate('ctgry', 'name') // Populate category name
//     .select('_id title price realPrice discount colour productCode description ctgry photo')
//     .then(result => {
//       res.status(200).json({
//         product: result
//       });
//     })
//     .catch(err => {
//       res.status(500).json({
//         error: err
//       });
//     });
// });

// // Delete product by ID
// router.delete('/:productId', checkAuth, (req, res, next) => {
//   Product.remove({ _id: req.params.productId })
//     .then(result => {
//       res.status(200).json({
//         message: 'Product has been deleted',
//         result: result
//       });
//     })
//     .catch(err => {
//       res.status(500).json({
//         error: err
//       });
//     });
// });

// module.exports = router;
 