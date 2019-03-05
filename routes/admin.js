const express = require('express');
const router = express.Router();

const { 
        getAddProducts,
        getProducts, 
        postAddProducts,
        getEditProduct,
        postEditProduct,
        deleteProduct 
    } = require('../controllers/admin');

    // to display user input ui
    router.get('/addProducts', getAddProducts);
    
    // to render the user input data into admin/products.ejs 
    router.get('/products',getProducts);
    
    // only to deliver user input data from './admin/addProducts' to '/admin/products'
    router.post('/addProducts', postAddProducts);
    
    // to display user edit ui
    router.get('/editProduct/:id', getEditProduct);

    // to deliver the user editing product data to 'admin/products, shop/productList, and shop/index" 
    router.post('/editProduct', postEditProduct);

    // // to delete products in /cart and admin/products, shop/productList, and shop/index
    router.post('/deleteProduct', deleteProduct);

module.exports = router;