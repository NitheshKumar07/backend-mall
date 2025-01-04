// const express = require('express');
// const app = express();
// const productRoute = require('./api/routes/product');
// const userRoute = require('./api/routes/user');
// const categorypath = require('./api/routes/category')
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const { urlencoded, json } = require('body-parser');
// const cors = require('cors');
// const fileUpload = require('express-fileupload');


// mongoose.connect('mongodb+srv://Nitesh:nitesh07@crud.baggwua.mongodb.net/?retryWrites=true&w=majority&appName=CRUD',{useNewUrlParser:true, useUnifiedTopology: true});


// mongoose.connection.on('error',err=>{
//   console.log('connection failed');
// });

// mongoose.connection.on('connected',()=>{
//   console.log('connected successfully with database');
// });

// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());

// app.use(fileUpload({
//   useTempFiles:true
// }))

// app.use(cors());

// app.use('/product',productRoute);
// app.use('/user',userRoute);
// app.use('/category',categorypath);

// app.get('*',(req,res,next)=>{
//   res.status(200).json({
//     message:'bad request'
//   })
// })

// module.exports = app;
// ..........................................................................................
const express = require('express');
const app = express();
const productRoute = require('./api/routes/product');
const userRoute = require('./api/routes/user');
const categorypath = require('./api/routes/category');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { urlencoded, json } = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

// Connect to MongoDB
mongoose.connect('mongodb+srv://Nitesh:nitesh07@crud.baggwua.mongodb.net/?retryWrites=true&w=majority&appName=CRUD', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', err => {
  console.log('Connection failed');
});

mongoose.connection.on('connected', () => {
  console.log('Connected successfully with database');
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// File upload middleware
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Configure CORS
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://shop-mall-omega.vercel.app', // Deployed frontend domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

// Routes
app.use('/product', productRoute);
app.use('/user', userRoute);
app.use('/category', categorypath);

// Catch-all route
app.get('*', (req, res, next) => {
  res.status(404).json({
    message: 'Bad request',
  });
});

module.exports = app;
