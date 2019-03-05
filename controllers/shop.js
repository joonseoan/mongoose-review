const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render('shop/productList', { 
                products, 
                docTitle: 'All Products', 
                path: '/products'
            });
        })
        .catch(e => { throw new Error('Failed to get product list.'); });

}

exports.getIndex = (req, res, next) => {

    // mongoose find(), do not followd by cursor. 
    //  Therefore, do not need next() or toArray() which are required in mongoDB.
    Product.find()
    .then((products) => {
        res.render('shop/index', { 
            products, 
            docTitle: 'Shop', 
            path: '/'
        });
    })
    .catch(e => { throw new Error('Failed to get product index.'); });

 }

 exports.getProduct = (req, res, next) => {

    const id = req.params.id;

    // if(!mongoose.Types.ObjectId.isValid(id))
    //     throw new Error('Invalid product id');
    
    // it is mongoose's findById()
    Product.findById(id)
        .then(product => {

            // no array here other than the one used by mysql2
            res.render('shop/productDetail', {
                product,
                docTitle: product.title,
                path: '/products'
            });
        })
        .catch(e => { console.log(e)});

}

 exports.postCart = (req, res, next) => {

    const { id } = req.body;

    Product.findById(id)
        .then(product =>{

            // At this moment, product has the userId number
            return req.user.addToCart(product);
        })
        .then(() => {

            res.redirect('./cart');
        })
        .catch(e => {throw new Error('Unable to add the product to your cart.')})

}

exports.getCart = (req, res, next) => {

    // We must use req.user.getCart();
    req.user.getCart()
        .then(products => {

            console.log('reallty ------------------->', products)
            
            res.render('shop/cart', {
                docTitle: 'Your Cart',
                path: '/cart',
                products
            });

        })
        .catch(e => console.log(e));
    
}

exports.postOrder = (req, res, next) => {
        
    req.user.addOrder()
        .then(() => {

            res.redirect('/orders');
        
        })
        .catch(e => console.log(e));
    
}

exports.getOrders = (req, res, next) => {

    req.user.getOrders()
        .then(orders => {

            res.render('shop/orders', {
                docTitle: 'Your Orders',
                path: '/orders',
                orders
            });
        })
        .catch(e => console.log(e));    

}




// ------------------------- MongoDB -----------------------------
// const Product = require('../models/product');

// exports.getProducts = (req, res, next) => {

//     Product.fetchAll()
//         .then(products => {
//             res.render('shop/productList', { 
//                 products, 
//                 docTitle: 'All Products', 
//                 path: '/products'
//             });
//         })
//         .catch(e => {
//             console.log(e);
//         });
        
// }

// exports.getProduct = (req, res, next) => {
    
//     // id must be identified with router.get('/products/:id')
//     const { id } = req.params;
        
//     Product.findById(id)
//         .then(product => {

//             // no array here other than the one used by mysql2
//             res.render('shop/productDetail', {
//                 product,
//                 docTitle: product.title,
//                 path: '/products'
//             });
//         })
//         .catch(e => { console.log(e)});

// }

// exports.getIndex = (req, res, next) => {

//     // [ SELECT * FROM Table ]
//     // Also, we can set up 'WHERE' in findAll({where: ?})
//     // Without {where: ?}, it feches all data.

//     Product.fetchAll()
//         .then((products) => {
//             // products [ {id, title, price, imageUrl, description}, {id, title, price, imageUrl, description}]
//             // console.log(products);
//             res.render('shop/index', { 
//                 products,
//                 docTitle: 'Shop', 
//                 path: '/'
//             });        
//         })
//         .catch(e => console.log(e));

//     // Only with mysql2
//     // Product.fetchAll().then(([ products, meta ]) => {

//     //     console.log(products)
//     //     res.render('shop/index', { 
//     //         products, 
//     //         docTitle: 'Shop', 
//     //         path: '/'
//     //      });
//     // }).catch(err => {
//     //     console.log(err);
//     // });

//  }

//  // Add to Cart button
//  exports.postCart = (req, res, next) => {

//     const { id } = req.body;

//     Product.findById(id)
//         .then(product =>{

//             // At this moment, product has the userId number
//             return req.user.addToCart(product);
//         })
//         .then(() => {

//             res.redirect('./cart');
//         })
//         .catch(e => {throw new Error('Unable to add the product to your cart.')})

// }

// // Required Association!!!
// exports.getCart = (req, res, next) => {

//     // We must use req.user.getCart();
//     req.user.getCart()
//         .then(products => {

//             console.log('reallty ------------------->', products)
            
//             res.render('shop/cart', {
//                 docTitle: 'Your Cart',
//                 path: '/cart',
//                 products
//             });

//         })
//         .catch(e => console.log(e));
    
// }

// exports.postOrder = (req, res, next) => {
        
//     req.user.addOrder()
//         .then(() => {

//             res.redirect('/orders');
        
//         })
//         .catch(e => console.log(e));
    
// }

// exports.getOrders = (req, res, next) => {

//     req.user.getOrders()
//         .then(orders => {

//             res.render('shop/orders', {
//                 docTitle: 'Your Orders',
//                 path: '/orders',
//                 orders
//             });
//         })
//         .catch(e => console.log(e));    

// }

// exports.postCartDeleteItem = ( req, res, next) => {

//     const { id }= req.body;

//     req.user.deleteItemFromCart(id)
//         .then(() => {

//             res.redirect('/cart');

//         })
//         .catch(e => {

//             throw new Error('Unable to delete.');
        
//         });
// }

// exports.getCheckout = (req, res, next) => {

//     res.render('shop/checkout', {
//         docTitle: 'Checkout',
//         path: '/checkout'
//     });

// }