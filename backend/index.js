const PORT = process.env.PORT || 4000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));


app.use(express.json());



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);


//API Creation

app.get('/', (req, res) => {
    res.send('Express app is running');
});



// Image Storage Engine

const Storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});



const upload = multer({
    storage: Storage
});

//Creating upload endpoint for image
app.use('/images', express.static('upload/images'));

app.post('/upload', upload.single('product'), (req, res) => {
    res.json({ 
        success: 1,
        image_url: `${BASE_URL}/images/${req.file.filename}`
    });
});

//Schema for Products
const Product = new mongoose.model("Product",{
    id:{
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    }
    
});


app.post ('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else{
        id = 1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    console.log(product);
    await product.save();
    console.log('Saved');
    res.json({
        success: true,
        name: req.body.name,  
    });
});

// Delete Product

app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({id: req.body.id});
    console.log('Deleted');
    res.json({
        success: true,
        name: req.body.name,
    });
});

// Get all products

app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("all products fetched");
    console.log(products);
    res.send(products);
});

//Schema Creating User Model
const Users = new mongoose.model("Users", {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    cartData:{
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

//Creating Endpoints for registring User
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({email: req.body.email});
    if(check){
        return res.status(400).json({
            success: false,
            message: 'User already exists'
        }); 
    }
    let cart= {};
    for (let i = 0; i < 300; i++){
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart
    });
    await user.save();
    const data = {
        user: {
            id: user.id
        }
    }
    const token = jwt.sign(data, 'secret_ecom');
    res.json({success:true,token});
});

//Creating Endpoints for Login User
app.post('/login', async (req, res) => {
    let user = await Users.findOne({
        email: req.body.email   
    });
    if(user){
        const passCompare = user.password === req.body.password;
        if(passCompare){
            const data = {
                user: {
                    id: user.id
                }
            }  
            const token = jwt.sign
            (data
            , 'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,message: 'Password is incorrect'});
        }
    }
    else{
        res.json({success:false,message: 'User not found'});
    }
});

//Creating endpoint for newCollection data
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newCollection = products.slice(1).slice(-8);
    console.log("new collection fetched");
    res.send(newCollection);
});

//Creating endpoint for Popular in women section
app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({category:"women"});
    let popular_In_Women = products.slice(0,4);
    console.log("popular in women fetched");
    res.send(popular_In_Women);
} );

//Creating middleware to fetch user

const fetchUser = (req, res, next) => {
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: 'Please authenticate using a valid token'});
    }
    try{
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user;
        next();
    }
    catch(error){
        res.status(401).send({error: 'Please authenticate using a valid token'});
    }
}

//Creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser, async (req, res) => {
    console.log("added to cart", req.body.itemId);
    let userData = await Users.findOne({_id: req.user.id});
    userData.cartData[ req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData});
    res.send("added to cart");
} );

//Creating endpoint for removing products from cartdata
app.post('/removefromcart',fetchUser, async (req, res) => {
    console.log("removed from cart", req.body.itemId);
    let userData = await Users.findOne({_id: req.user.id});
    if (userData.cartData[req.body.itemId] < 0)
    userData.cartData[ req.body.itemId] -= 1;
    await Users
    .findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData});
    res.send("removed from cart");
});

//Creating endpoint for getting cartdata
app.post('/fetchcartdata',fetchUser, async (req, res) => {
    console.log("fetching cart data");
    let userData = await Users.findOne({_id: req.user.id});
    res.json(userData.cartData);
});

app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server running on port ${PORT}`);
    }
    else {
        console.log('Error: ' + error);
    }
});
