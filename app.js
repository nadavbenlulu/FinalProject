require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const { pid } = require('process');
const app = express();

const Product = require('./api/v1/models/product'); 
// --- ייבוא מודל ההזמנות כדי שנוכל לשמור את הלחיצה ---
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
app.use(express.json()); // חשוב מאוד עבור ה-fetch מה-index
app.use(express.urlencoded({ extended: true }));

// --- הנתיב החדש: שמירת המוצר ב-Database בלחיצה ---
app.post('/add-to-cart', async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "ID חסר" });
        }

        // יצירת רשומה חדשה בטבלת ההזמנות (או סל הקניות)
        const newSelection = new Order({
            _id: new mongoose.Types.ObjectId(),
            pid: productId,
            orderDate: new Date()
            // אם יש לך יוזר מחובר ב-Session, אפשר להוסיף כאן: uid: req.session.userId
        });

        await newSelection.save();
        
        console.log("מוצר נשמר ב-DB בהצלחה:", productId);
        res.json({ success: true });
    } catch (error) {
        console.error("Error saving selection:", error);
        res.status(500).json({ success: false });
    }
});

// --- ראוטר דף הבית ---
app.get('/', async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('index', { 
            products: products,
            pageTitle: "דף הבית - מוצרים" 
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("שגיאה בטעינת המוצרים");
    }
});

app.use('/product', productrouter);
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













// require('dotenv').config();

// const express = require('express');
// const jwt = require('jsonwebtoken');
// const { pid } = require('process');
// const app = express();

// // --- ייבוא המודל של המוצרים (הוספתי את זה) ---
// const Product = require('./api/v1/models/product'); 

// const productrouter = require('./api/v1/routes/product');
// const orderRouter = require('./api/v1/routes/order');
// const categoryRouter = require('./api/v1/routes/category');
// const userRouter = require('./api/v1/routes/user');
// const morgan = require('morgan');
// const ipFilter = require('./api/v1/middelwares/ipFilter');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const hbs = require('express-handlebars');

// app.set('views', './api/v1/views');

// app.engine('handlebars', hbs.engine({
//     layoutsDir: './api/v1/views/layouts',
//     partialsDir: './api/v1/views/partials',
//     defaultLayout: 'main' // ודא שיש לך קובץ main.handlebars בתיקיית layouts
// }));
// app.set('view engine', 'handlebars');

// app.use(cors());
// app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // --- עדכון הראוטר של דף הבית ---
// app.get('/', async (req, res) => {
//     try {
//         // שליפת המוצרים והפיכתם לאובייקטים פשוטים עבור Handlebars באמצעות .lean()
//         const products = await Product.find().lean();
        
//         // רינדור דף ה-index ושליחת מערך המוצרים אליו
//         res.render('index', { 
//             products: products,
//             pageTitle: "דף הבית - מוצרים" 
//         });
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).send("שגיאה בטעינת המוצרים");
//     }
// });

// app.use('/product', productrouter);
// app.use('/order', orderRouter);
// app.use('/user', userRouter);
// app.use('/category', categoryRouter);
// app.use(express.static('public'));

// const mongoUser = process.env.MONGO_USER;
// const mongoPass = process.env.MONGO_PASS;
// const mongoServer = process.env.MONGO_SERVER;

// const mongoConstr = `mongodb+srv://${mongoUser}:${mongoPass}@${mongoServer}/test`;

// // הדפסה לבדיקה (תוכל להסיר אחרי שהכל עובד)
// console.log("Connecting to:", mongoServer);

// mongoose.connect(mongoConstr).then(() => {
//     console.log("connected to MongoDB");
// }).catch((err) => {
//     console.error("MongoDB connection error:", err);
// });

// module.exports = app;


// require('dotenv').config();// הפעלת פונקציה שמשלבת את משתנה הסביבה מתוך הקובץ dotinit

// // פה כל הקוד של השרת מגדיר אותו  
// const express=require('express');// חיבור לספריית אקספרס
// const jwt = require('jsonwebtoken');
// const { pid } = require('process');
// const app=express();// יצירת מופע של אפלקיציית  השרת 
// const productrouter=require('./api/v1/routes/product');
// const orderRouter=require('./api/v1/routes/order');
// const categoryRouter=require('./api/v1/routes/category');
// const userRouter=require('./api/v1/routes/user');
// const morgan=require('morgan');//קישור לספריית מורגן לניטור בקשות http 
// const ipFilter=require('./api/v1/middelwares/ipFilter');
// const mongoose=require('mongoose');// קישור לספריית מונגוס
// const cors = require('cors');
// const hbs = require('express-handlebars');//חיבור לספריית הטמפלייטיניג איתה אנו עובדים 
// app.set('views','./api/v1/views');//הגדרת התיקייה בה נמצאות התצוגות שלנו 
// //הגדרת מנוע טמפלייטינג בתוך האפליקציה שלנו 
// app.engine('handlebars',hbs.engine({
// layoutsDir:'./api/v1/views/layouts',
// partialsDir:'./api/v1/views/partials'
// }));
// app.set('view engine','handlebars');//הגדרת התצוגה של הנדלברס כתצוגה אקטיבית באפליקציה 
// app.use(cors());
// //רישום ראוטרים באפךיקצייה
// app.use(morgan('dev'));//שימוש במורגן לניטור בקשות http בפורמט פיתוח 
// app.use(express.json());//הוספת שכבה לטיפול בבקשות בקידוד של גייסון
// app.use(express.urlencoded({ extended: true }));
// //app.use(express.urlencoded());//הוספת שכבה לטיפול בבקשות עם גוף בקשה לקידוד של יוראל אנקודד
// app.get('/', (req, res) => {
//     res.render('index'); // או כל שם אחר שיש לקובץ הראשי שלך בתיקיית ה-views
// });
// app.use('/product',productrouter);//שילוב הראוטר בתוך האפליקצייה 
// app.use('/order',orderRouter);
// app.use('/user',userRouter);
// app.use('/category',categoryRouter);
// app.use(express.static('public'));//הגדרת התיקייה כתיקייה סטטית כלומר ניתן לבצע חיפוש של נתיבי קבצים ישירות בתיקייה זו 

// const mongoUser=process.env.MONGO_USER;//קישור ל env לשם משתמש 
// const mongoPass=process.env.MONGO_PASS;//קישור לסיסמה
// const mongoServer=process.env.MONGO_SERVER;//קישור לשרת 
// //התחברות לענן מונגו 
// const mongoConstr=`mongodb+srv://${mongoUser}:${mongoPass}@${mongoServer}/test`;
// console.log(mongoConstr)
// mongoose.connect(mongoConstr).then((stat)=>{
// console.log("connected to MongoDB");
// })


// module.exports=app;
