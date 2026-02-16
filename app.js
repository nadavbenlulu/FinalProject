require('dotenv').config();// הפעלת פונקציה שמשלבת את משתנה הסביבה מתוך הקובץ dotinit

// פה כל הקוד של השרת מגדיר אותו  
const express=require('express');// חיבור לספריית אקספרס
const jwt = require('jsonwebtoken');
const { pid } = require('process');
const app=express();// יצירת מופע של אפלקיציית  השרת 
const productrouter=require('./api/v1/routes/product');
const orderRouter=require('./api/v1/routes/order');
const categoryRouter=require('./api/v1/routes/category');
const userRouter=require('./api/v1/routes/user');
const morgan=require('morgan');//קישור לספריית מורגן לניטור בקשות http 
const ipFilter=require('./api/v1/middelwares/ipFilter');
const mongoose=require('mongoose');// קישור לספריית מונגוס
const cors = require('cors');
const hbs = require('express-handlebars');//חיבור לספריית הטמפלייטיניג איתה אנו עובדים 
app.set('views','./api/v1/views');//הגדרת התיקייה בה נמצאות התצוגות שלנו 
//הגדרת מנוע טמפלייטינג בתוך האפליקציה שלנו 
app.engine('handlebars',hbs.engine({
layoutsDir:'./api/v1/views/layouts',
partialsDir:'./api/v1/views/partials'
}));
app.set('view engine','handlebars');//הגדרת התצוגה של הנדלברס כתצוגה אקטיבית באפליקציה 
app.use(cors());
//רישום ראוטרים באפךיקצייה
app.use(morgan('dev'));//שימוש במורגן לניטור בקשות http בפורמט פיתוח 
app.use(express.json());//הוספת שכבה לטיפול בבקשות בקידוד של גייסון
app.use(express.urlencoded({ extended: true }));
//app.use(express.urlencoded());//הוספת שכבה לטיפול בבקשות עם גוף בקשה לקידוד של יוראל אנקודד
app.get('/', (req, res) => {
    res.render('index'); // או כל שם אחר שיש לקובץ הראשי שלך בתיקיית ה-views
});
app.use('/product',productrouter);//שילוב הראוטר בתוך האפליקצייה 
app.use('/order',orderRouter);
app.use('/user',userRouter);
app.use('/category',categoryRouter);
app.use(express.static('public'));//הגדרת התיקייה כתיקייה סטטית כלומר ניתן לבצע חיפוש של נתיבי קבצים ישירות בתיקייה זו 

const mongoUser=process.env.MONGO_USER;//קישור ל env לשם משתמש 
const mongoPass=process.env.MONGO_PASS;//קישור לסיסמה
const mongoServer=process.env.MONGO_SERVER;//קישור לשרת 
//התחברות לענן מונגו 
const mongoConstr=`mongodb+srv://${mongoUser}:${mongoPass}@${mongoServer}/test`;
console.log(mongoConstr)
mongoose.connect(mongoConstr).then((stat)=>{
console.log("connected to MongoDB");
})


module.exports=app;
