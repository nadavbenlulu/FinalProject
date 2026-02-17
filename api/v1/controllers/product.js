const mongoose = require('mongoose');
const Product = require('../models/product');

const obj = {
    // שליפת כל המוצרים
    getALLProduct: (req, res) => {
        Product.find().lean().then((products) => {
            // שים לב: שיניתי ל-'index' כי זה הדף הראשי שבו בנינו את הרשימה
            return res.status(200).render('index', { layout: 'main', products });
        });
    },

    // שליפת מוצר בודד לפי ID (הפונקציה שמעדכנת את הדף המעוצב החדש)
    getproductbyid: (req, res) => {
        const id = req.params.id;
        
        // חיפוש לפי ה-ID המובנה של מונגו (_id) כדי למנוע טעויות
        Product.findById(id).lean().then((prod) => {
            if (!prod) {
                return res.status(404).send("מוצר לא נמצא");
            }
            console.log("Found product:", prod.pname);
            // שליחה לעיצוב החדש ב-product.handlebars
            return res.status(200).render('product', { 
                layout: 'main', 
                pid: id, 
                prod: prod 
            });
        }).catch(err => {
            console.error(err);
            res.status(500).send("שגיאה בשליפת המוצר");
        });
    },

    addNewProduct: (req, res) => {
        const pid = req.body.pid;
        Product.find({ pid: pid }).then((data) => {
            if (data.length > 0) {
                return res.status(200).json({ message: `product id ${pid} already exist` });
            } else {
                Product.create(req.body).then((prod) => { // השתמש ב-create במקום insertOne
                    return res.status(200).json(prod);
                });
            }
        });
    },

    updateProductById: (req, res) => {
        const id = req.params.id;
        Product.findByIdAndUpdate(id, req.body, { new: true }).then((prod) => {
            return res.status(200).json(prod);
        });
    },

    deleteProductById: (req, res) => {
        const id = req.params.id;
        Product.findByIdAndDelete(id).then((prod) => {
            return res.status(200).json(prod);
        });
    }
};

module.exports = obj;




// const mongoose=require('mongoose');
// const Product=require('../models/product');
// const product = require('../models/product');

// const obj={
// getALLProduct:(req,res)=>{
//    Product.find().lean().then((data)=>{
//       return res.status(200).render('products',{layout:'main',data});
//    })
//     },

//     addNewProduct: (req, res) => {
//   const pid = req.body.pid;
// //לפני הוספת מוצר חדש נבדוק האם קיים מוצר אם אותו קוד מוצר
//   Product.find({ pid: pid }).then((data) => {
//     if (data.length > 0) {
//       return res
//         .status(200)
//         .json({ message: `product id ${pid} already exist` });
//     } else {
//       Product.insertOne(req.body).then((prod) => {
//         return res.status(200).json(prod);
//       });
//     }
//   });
// },

//     addProductById:  (req,res)=>{
//        const pid=req.params.id;
//       Product.insertOne(req.body).then((prod)=>{
//          return res.status(200).json(prod);
//       });
//     },    
//     updateProductById:(req,res)=>{
//       const pid=req.params.id;
//       Product.updateOne({pid},req.body).then((prod)=>{
//          return res.status(200).json(prod);
//       });
        
//    },

// //חדש
// deleteProductById:(req,res)=>{
//       const pid=req.params.id;
//       Product.deleteOne({pid}).then((prod)=>{
//          return res.status(200).json(prod);
//       })
//     } ,

//     //חדש קוד 
//     getproductbyid: (req,res)=>{
//       const id=req.params.id;
//       Product.find({pid:id}).lean().then((prod)=>{
//         console.log(prod[0]);
//          return res.status(200).render('product',{layout:'main',pid:id,prod:prod[0]});
//          })
//     } ,
// }
// module.exports=obj