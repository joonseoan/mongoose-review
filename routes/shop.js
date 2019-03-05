const express = require('express');
const router = express.Router();

const { 
    getProducts, 
    getIndex, 
    getCart,
    postCart,
    getOrders, 
    getProduct,
    postCartDeleteItem,
    postOrder } = require('../controllers/shop');

// product list page with product details
router.get('/products', getProducts);

// index page with all product list
// Must differentiate app.use((req, res, next)) by using 'get' 
//   which is required to specify an exact route 
router.get('/', getIndex);

router.get('/products/:id', getProduct);

// to have all items in cart
router.get('/cart', getCart);

// to add a product to '/cart'
router.post('/cart', postCart);

// // to delete a product only in '/shop/cart'
// router.post('/cartDeleteItem', postCartDeleteItem);

// // to add user-order
// router.post('/createOrders', postOrder);

// // // to display user-order
// router.get('/orders', getOrders);

module.exports = router;