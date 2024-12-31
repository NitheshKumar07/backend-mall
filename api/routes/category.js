const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../model/category');
const cloudinary = require('cloudinary').v2;
const checkAuth = require('../middleware/check-auth');

cloudinary.config({
    cloud_name:'do5njjj0c',
    api_key:'336484368396985',
    api_secret:'eKWEzhcDTRgAH9MJDmszQqAX8JQ'
  });

router.get('/',checkAuth,(req,res,next)=>{
    Category.find()
    .select(' _id name photo')
    .then(result=>{
       res.status(200).json({
           category:result
       }) 
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})

// save category
router.post('/',checkAuth,(req,res,next)=>{
    console.log(req);
    console.log(req.files);
    const file = req.files.photo;
    cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
      console.log(result);
      category = new Category({
        _id:new mongoose.Types.ObjectId,
        name:req.body.name,
        photo:result.url
      });
      category.save()
      .then(result=>{
        console.log(result);
        res.status(200).json({
          new_category:result
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

  //get single category by id
router.get('/:id',(req,res,next)=>{
  const _id = req.params.id;
  Category.findById(_id)
  .select('_id name photo')
  .then(result=>{
    // console.log(result)
    res.status(200).json({
      category:result
    })
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    })
  })
})


  // update
router.put('/:id',(req,res,next)=>{
  console.log(req.params.id);
  const file = req.files.photo;
  console.log(file);
  cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
    console.log(result);
    Category.findOneAndUpdate({_id:req.params.id},{
      $set:{
        name:req.body.name,
        photo:result.url
      }
    })
    .then(result=>{
      res.status(200).json({
        updated_category:result
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

router.delete('/', (req, res, next) => {
  const imageUrl = req.query.imageUrl;
  const urlArray = imageUrl.split('/');
  console.log(urlArray)
  const image = urlArray[urlArray.length - 1]
  console.log(image)
  const imageName = image.split('.')[0]
  console.log(imageName)
  categoryId = req.query.id;
  Category.remove({ _id: categoryId })
      .then(result => {
          cloudinary.uploader.destroy(imageName,(error,result)=>{
              console.log(error,result);
          })
          res.status(200).json({
              message: result
          })
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              error: err
          })
      })
})
module.exports = router;

// chatgpt....................................................................................................................................................

// Add Missing Authentication to Some Routes: The update, get, and delete routes should include authentication if you want to restrict access to authenticated users only.
// Handle Missing photo File: When updating a category, you should handle cases where photo might not be provided.
// Fix Deprecated Mongoose Methods: Use findByIdAndRemove instead of remove.
// Add Error Handling: Ensure all Cloudinary and database operations are properly handled.
// Here’s an updated version of your category.js with these improvements:


// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const Category = require('../model/category');
// const cloudinary = require('cloudinary').v2;
// const checkAuth = require('../middleware/check-auth');

// cloudinary.config({
//   cloud_name: 'do5njjj0c',
//   api_key: '336484368396985',
//   api_secret: 'eKWEzhcDTRgAH9MJDmszQqAX8JQ'
// });

// // Get all categories
// router.get('/', checkAuth, (req, res, next) => {
//   Category.find()
//     .select('_id name photo')
//     .then(result => {
//       res.status(200).json({
//         category: result
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

// // Save category
// router.post('/', checkAuth, (req, res, next) => {
//   if (!req.files || !req.files.photo) {
//     return res.status(400).json({
//       message: 'No photo file provided'
//     });
//   }

//   const file = req.files.photo;
//   cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({
//         error: err
//       });
//     }

//     const category = new Category({
//       _id: new mongoose.Types.ObjectId(),
//       name: req.body.name,
//       photo: result.url
//     });

//     category.save()
//       .then(result => {
//         res.status(200).json({
//           new_category: result
//         });
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).json({
//           error: err
//         });
//       });
//   });
// });

// // Get single category by ID
// router.get('/:id', checkAuth, (req, res, next) => {
//   const _id = req.params.id;
//   Category.findById(_id)
//     .select('_id name photo')
//     .then(result => {
//       if (!result) {
//         return res.status(404).json({
//           message: 'Category not found'
//         });
//       }
//       res.status(200).json({
//         category: result
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

// // Update category
// router.put('/:id', checkAuth, (req, res, next) => {
//   const _id = req.params.id;

//   const updateData = {
//     name: req.body.name
//   };

//   if (req.files && req.files.photo) {
//     const file = req.files.photo;
//     cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({
//           error: err
//         });
//       }
//       updateData.photo = result.url;

//       Category.findByIdAndUpdate(_id, { $set: updateData }, { new: true })
//         .then(result => {
//           res.status(200).json({
//             updated_category: result
//           });
//         })
//         .catch(err => {
//           console.log(err);
//           res.status(500).json({
//             error: err
//           });
//         });
//     });
//   } else {
//     Category.findByIdAndUpdate(_id, { $set: updateData }, { new: true })
//       .then(result => {
//         res.status(200).json({
//           updated_category: result
//         });
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).json({
//           error: err
//         });
//       });
//   }
// });

// // Delete category
// router.delete('/', checkAuth, (req, res, next) => {
//   const imageUrl = req.query.imageUrl;
//   const categoryId = req.query.id;

//   if (!imageUrl || !categoryId) {
//     return res.status(400).json({
//       message: 'Missing imageUrl or id'
//     });
//   }

//   const urlArray = imageUrl.split('/');
//   const image = urlArray[urlArray.length - 1];
//   const imageName = image.split('.')[0];

//   Category.findByIdAndRemove(categoryId)
//     .then(result => {
//       if (!result) {
//         return res.status(404).json({
//           message: 'Category not found'
//         });
//       }
//       cloudinary.uploader.destroy(imageName, (error, result) => {
//         if (error) {
//           console.log(error);
//           return res.status(500).json({
//             error: error
//           });
//         }
//         res.status(200).json({
//           message: 'Category deleted',
//           result: result
//         });
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

// module.exports = router;
