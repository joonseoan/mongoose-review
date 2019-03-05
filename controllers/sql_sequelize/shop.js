const Product = require('../models/product');

exports.getProducts = (req, res, next) => {

    Product.findAll()
        .then(products => {
            res.render('shop/productList', { 
                products, 
                docTitle: 'All Products', 
                path: '/products'
            });
        })
        .catch(e => {
            console.log(e);
        });
        
}

exports.getProduct = (req, res, next) => {
    
    // id must be identified with router.get('/products/:id')
    const { id } = req.params;
    
    // with sequelize
    
    // 2) But it is simpler than the one above.
    Product.findByPk(id)
        .then(product => {

            // no array here other than the one used by mysql2
            res.render('shop/productDetail', {
                product,
                docTitle: product.title,
                path: '/products'
            });
        })
        .catch(e => { console.log(e)});

    // 1) id : id => first one is from column name we defined
    //      the second one is form the variable above
    // Product.findAll({ where: {id}})
    //     .then(products => {
        
    //         // products : [{ id, title, price, imageUrl, description }]
            
    //         // no array here other than the one used by mysql2
    //         res.render('shop/productDetail', {
    //             product: products[0],
    //             docTitle: products[0].title,
    //             path: '/products'
    //         });
    //     })
    //     .catch(e => { console.log(e)});

    // -----------------------------------------------------
    // only with mysql2

    /* 
        In the Product class
        static findById(id) {
            return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
        }
    
    */
    // Product.findById(id)
    //     //By using ES6
    //     .then(([product]) => {
    //         console.log(product, 'products in [product]')
    //         res.render('shop/productDetail', {
    //             // 'product' is still an array.
    //             // We need to extract an element.
    //             product: product[0],
    //             docTitle: product[0].title,
    //             path: '/products'
    //          });
    //     })
    //     .catch(err => {console.log(err)});

}

exports.getIndex = (req, res, next) => {

    // [ SELECT * FROM Table ]
    // Also, we can set up 'WHERE' in findAll({where: ?})
    // Without {where: ?}, it feches all data.

    Product.findAll()
        .then((products) => {
            // products [ {id, title, price, imageUrl, description}, {id, title, price, imageUrl, description}]
            // console.log(products);
            res.render('shop/index', { 
                products,
                docTitle: 'Shop', 
                path: '/'
            });        
        })
        .catch(e => console.log(e));

    // Only with mysql2
    // Product.fetchAll().then(([ products, meta ]) => {

    //     console.log(products)
    //     res.render('shop/index', { 
    //         products, 
    //         docTitle: 'Shop', 
    //         path: '/'
    //      });
    // }).catch(err => {
    //     console.log(err);
    // });

 }

 // Add to Cart button
 exports.postCart = (req, res, next) => {

    let fetchCart;

    // product id
    const { id } = req.body;

    let newQty = 1;

    req.user.getCart()
        .then(cart => {

            fetchCart = cart;

            // console.log(cart.getProducts());
            // based on product id, products has an element, it is an array, though.
            return cart.getProducts({ where: { id } });
        })
        .then(products => {
            
            let product;
            
            if(products.length > 0) {

                // based on product id, products has an element.
                product = products[0];

            }
            
            // handling the exisiting product,
            //      we just need to update the qty.
            if(product) {
                
                // through instance, update attibute of the class
                // can be "cart.cartItems.qty" as well.

                // as soon as addProdct(product, { through { qty: newQty } }) excutes,
                // cartitems assigned to 'product' and 'cart'
                const oldQty = product.cartItems.qty;
                newQty = oldQty + 1;
                
                // just update is required.
                // just fetch all data associated with productId in that table 
                //  and update qty in the table.
                // return fetchCart.addProduct(product, { through : { qty: newQty } });
                
                // refactoring
                return product;

            } 

            // Because for now, we do not have any product,
            // For the first product in cart
            return Product.findByPk(id);
                // .then(product => {
                    
                    // How to fetch this data?
                    
                     // The first parameter: fetch all information asscociated productId
                     // The second paramter: update the through table (cartItems) by using Deep clone 
                     //     is required for the qty

                     // The it will be stored like the one below.
                     /* 
                    
                        product {
                            dataValues:
                            { id: 1,
                                title: 'aaa',
                                price: 111,
                                imageUrl: 'aaa',
                                description: 'afasfa',
                                createdAt: 2019-02-23T04:30:10.000Z,
                                updatedAt: 2019-02-23T04:30:10.000Z,
                                userId: 1,
                                //********************************************* 
                                cartItems: [cartItems] 
                            }
                            
                    */
                    // return fetchCart.addProduct(product, { through: {qty : newQty }});
                // });

        })
        .then(product => {
            
            // The first parameter: fetch all information asscociated productId
            // The second paramter: update the through table (cartItems) by using Deep clone 
            //     is required for the qty
            
            // product.cartItems.qty is for updating attributes in class by using instance
            // It is for executing a function inside of the class

            // Hence, it is not working : it is not a format of addProduct function
            // return fetchCart.addProduct(product, through[qty] = newQty );
            return fetchCart.addProduct(product, { through: { qty: newQty } });
            
        })
        .then(() => {
            res.redirect('./cart');
        })
        .catch(e => console.log(e));

}

// Required Association!!!
exports.getCart = (req, res, next) => {

    // We must use req.user.getCart();
    req.user.getCart()
        .then(cart => {

            /* 
            
                    cart {
                        dataValues:
                        { id: 1,
                            createdAt: 2019-02-23T04:06:27.000Z,
                            updatedAt: 2019-02-23T04:06:27.000Z,
                            userId: 1 
                        }
            
            */
            // console.log(cart);
            
            /* 
                Purlal 's' of getProducts() is because of many to many association
                Only in many to many association, it enables us 
                to make getCarts(); and also getProducts() through CartItems.
                
                // product.get/set/addCarts() and addCart()
                Cart.belongsToMany(Product, { through: CartItems });

                // cart.get/set/addProducts() and addProduct()
                Product.belongsToMany(Cart, { through: CartItems });
            */
            if(cart) return cart.getProducts();
        })
        .then(products => {

            /* 
                [ product {
                    dataValues:
                    { id: 1,
                    title: 'aaa',
                    price: 111,
                    imageUrl: 'aaa',
                    description: 'afasfa',
                    createdAt: 2019-02-23T04:30:10.000Z,
                    updatedAt: 2019-02-23T04:30:10.000Z,
                    userId: 1,
                    cartItems: [cartItems] },
                     { id: 2,
                    title: 'bbb',
                    price: 33,
                    imageUrl: 'bbb',
                    description: 'bbb',
                    createdAt: 2019-02-23T05:22:35.000Z,
                    updatedAt: 2019-02-23T05:22:35.000Z,
                    userId: 1,
                    cartItems: [cartItems] }
                ]      
            
            */
            // console.log('products: ====================================================> ', products)
            
            res.render('shop/cart', {
                docTitle: 'Your Cart',
                path: '/cart',
                products
            });
        })
        .catch(e => console.log(e));
    
}

exports.postOrder = (req, res, next) => {
    
    let fetchedCart;
    
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            
            // console.log('products ===============================================> ', products.cartItems)

            // because Order.belongsTo(User);
            // User.hasMany(Order);

            // INSERT id with userId
            //  because 'Order' table has 'id' only that automatically increments
            return req.user.createOrder()
                .then(order => {

                    /* 
                        {   
                            id: 1,
                            userId: 1,
                            updatedAt: 2019-02-27T03:32:47.744Z,
                            createdAt: 2019-02-27T03:32:47.744Z 
                        }
                    
                    
                    */
                    console.log('order: ========================================> ', order)

                    // Adding new products with orderItems row by row

                    // => [1, 1]
                    // const ddd = products.map(product => {
                    //     return product.orderItems = {qty: product.cartTiems.qty };
                    // });
                    return order.addProducts(products.map(product => {

                        /* 
                            {   
                                
                                id: 1,
                                title: 'aaa',
                                price: 22,
                                imageUrl: 'aaa',
                                description: 'aaa',
                                createdAt: 2019-02-27T03:32:44.000Z,
                                updatedAt: 2019-02-27T03:32:44.000Z,
                                userId: 1,
                                cartItems:
                                cartItems {
                                    dataValues: [Object],
                                    _previousDataValues: [Object],
                                    _changed: {},
                                    _modelOptions: [Object],
                                    _options: [Object],
                                    __eagerlyLoadedAssociations: [],
                                    isNewRecord: false } 
                            }
                        
                        */

                        // product.orderItems = { qty: product.cartItems.qty };
                        product.addOrder(order, { through: { qty : product.cartItems.qty }});

                        // return [ product, product ]
                        return product;

                        // Then run addProducts while we are fetching products

                    }));                
                
                })
                .catch(e => console.log(e));
        
        })
        .then((orders) => {

            // Once the order is done, 
            //  'CartItems' is going to be empty.
            return fetchedCart.setProducts(null);

        })
        .then(() => {

            res.redirect('./orders');
        
        })
        .catch(e => console.log(e));
    
}

exports.getOrders = (req, res, next) => {
    /* 
        order in ejs ============================================> order {
        have products ********************************
        { 
            id: 1,
            createdAt: 2019-02-27T03:32:47.000Z,
            updatedAt: 2019-02-27T03:32:47.000Z,
            userId: 1,
            products: [ [product] ] 
        },    
            
    */

    // one:many therefore, user.getOrder(x)
    // Order : Product is a many to many
    // Therefore, getOrder invoke eagerLoading with include:['products]
    
    // 2) dried up statement
    req.user.getOrders({ include: ['products']})
    
    // 1) based on the standard document
    // req.user.getOrders({ include: {
        //     model: Product
        // }})
        .then(orders => {

            //    [ {createdAt: 2019-02-27T05:43:54.000Z,
            //         updatedAt: 2019-02-27T05:43:54.000Z,
            //         userId: 1,
            //         products: [Array] } ],
            console.log('final products : =======================================================================> ', orders)

            res.render('shop/orders', {
                docTitle: 'Your Orders',
                path: '/orders',
                orders
            });
        })
        .catch(e => console.log(e));    

}

exports.postCartDeleteItem = ( req, res, next) => {

    const { id }= req.body;

    req.user.getCart().then(cart => {
        return cart.getProducts({ where : { id }});
    })
    .then(products =>{
        const product = products[0];
        // delete cartItems inside of
        /* 

            dataValues:
                { id: 1,
                    title: 'aaa',
                    price: 111,
                    imageUrl: 'aaa',
                    description: 'afasfa',
                    createdAt: 2019-02-23T04:30:10.000Z,
                    updatedAt: 2019-02-23T04:30:10.000Z,
                    userId: 1,
                    //********************************************* 
                    cartItems: [cartItems] 
                }
        
        */
        console.log('product.cartItems: ', product.cartItems);

        // delete cartItems rows including qty if the rows are linked to productId
        return product.cartItems.destroy();
    })
    .then(() => {
        res.redirect('./cart');
    })
    .catch(err => {
        console.log(err);
    });

    // With a json file only
    // Product.findProductById(id, product => {
    //     console.log('deleteCartPRODUCT ITEM: ', product)
    //     Cart.deleteProduct(id, product.price);
    //     res.redirect('/cart');
    // });

}

exports.getCheckout = (req, res, next) => {

    res.render('shop/checkout', {
        docTitle: 'Checkout',
        path: '/checkout'
    });

}