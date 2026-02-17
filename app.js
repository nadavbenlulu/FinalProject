require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const Product = require('./api/v1/models/product'); 
const Order = require('./api/v1/models/order'); 

const productrouter = require('./api/v1/routes/product');
const orderRouter = require('./api/v1/routes/order');
const categoryRouter = require('./api/v1/routes/category');
const userRouter = require('./api/v1/routes/user');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const hbs = require('express-handlebars');

app.set('views', './api/v1/views');

app.engine('handlebars', hbs.engine({
    layoutsDir: './api/v1/views/layouts',
    partialsDir: './api/v1/views/partials',
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- שמירת מוצר בסל ---
app.post('/add-to-cart', async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ success: false, message: "ID חסר" });
        }

        const newSelection = new Order({
            _id: new mongoose.Types.ObjectId(),
            pid: productId,
            orderDate: new Date()
        });

        await newSelection.save();
        res.json({ success: true });
    } catch (error) {
        console.error("Error saving selection:", error);
        res.status(500).json({ success: false });
    }
});

// --- שלב 1: ראוטר דף הבית - מציג רק התחברות ---
app.get('/', (req, res) => {
    res.render('index', { 
        products: [], // לא שולחים מוצרים לדף הבית
        pageTitle: "התחברות למערכת" 
    });
});

// --- שלב 2: שאר הנתיבים ---
app.use('/product', productrouter); // כאן יוצגו המוצרים אחרי ההתחברות
app.use('/order', orderRouter);
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use(express.static('public'));

const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASS;
const mongoServer = process.env.MONGO_SERVER;
const mongoConstr = `mongodb+srv://${mongoUser}:${mongoPass}@${mongoServer}/test`;

mongoose.connect(mongoConstr).then(() => {
    console.log("connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

module.exports = app;

