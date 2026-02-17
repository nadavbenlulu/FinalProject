const express = require('express');
const router = express.Router();
const productsController = require('../controllers/product'); // תיקון שגיאת כתיב קלה בקישור

// נקודת קצה לשליפת כל המוצרים 
router.get('/', productsController.getALLProduct);

// נקודת קצה להצגת דף מוצר בודד (זה הנתיב שמפעיל את product.handlebars)
router.get('/:id', productsController.getproductbyid);

// נקודת קצה להוספת מוצר חדש
router.post("/", productsController.addNewProduct); 

// נקודת קצה לעדכון מוצר קיים 
router.put('/:id', productsController.updateProductById);

// נקודת קצה למחיקת מוצר (הוספתי :id כדי שהשרת ידע מה למחוק)
router.delete('/:id', productsController.deleteProductById);

module.exports = router;
