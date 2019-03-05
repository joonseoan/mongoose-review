const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {

    res.render('admin/editProducts', {
        docTitle: 'Add Products',
        path: '/admin/addProducts',
        editing: false
      
    });

}

// to INSERT 'user input data' to the database
exports.postAddProducts = (req, res, next) => {
    
    const {title, imageUrl, description, price } = req.body;
    
    // with sequelize

    // [INSERT]
    // create: immediately create element data(value) 
    //      and automatically save the value in the table.
    // build: (in javascript code) create element data(value)
    //      and required to manually save the value with another code.

    // --------------------------------------------------------
    // 3) More Elegant way : 
    //     When insert data into a table: Product.create() 
    //     When insert data into associate tables: createProduct({})
    
    // Then, the class is instantiated with the child class having the instance
    //   that is from User to access to the parent class's method.

    // By the way, it uses promise() to return the result.
    // The function name is strict!!!!

    // if user is an instance itself, we can use user.createProduct()
    // user.hasMany(Product) => user.set/get/create({})
    //
    req.user.createProduct({

        title,
        price,
        imageUrl,
        description
    
    })
    .then(() => {
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
    });

    // 2) With association
    // Product.create({
    //     title,
    //     price,
    //     imageUrl,
    //     description,
    //     // must be same name as in database *****
    //     // the name(alias?) is automatically populated ****
    //     //   when the primary key names are same????
    //     userId : req.user.id
    // })
    // .then(result => {
    //     console.log(result);
    //     res.redirect('/admin/products');
    // })
    // .catch(e => {console.log(e)});

    // 1) Without association
    // query is structured by Promise()
    // Product.create({
    //     title,
    //     price,
    //     imageUrl,
    //     description
    // })
    // .then(result => {
    //     console.log(result);
    //     res.redirect('/admin/products');
    // })
    // .catch(e => {console.log(e)});

    // only with mysql2 
    // 'product' for a particular document, not for all ducuments in a collectionn. 
    // const product = new Product(null, title, imageUrl, description, price);
    
    // // save =>  insert
    // product
    //     .save()
    //     .then(() => {
    //         res.redirect('/');
    //     })
    //     .catch(err => {console.log(err)});

}

exports.getEditProduct = (req, res, next) => {

    console.log('req.query: ', req.query); // => req.query:  { edit: 'true', new: 'title' }

    // STRING, by the way
    const editMode = req.query.edit;

    if(!editMode) return res.redirect('/');

    const id = req.params.id;

    // 2) With Assoication  
    // It is logically more clear because it is from the user who already registered for his products
    // When that user logged in, he can edit the products.

    // Looking for product's id to render current exsiting product information.
    // It returns info in an array because one to many associations.
    // 1) Join User and Product tables on userId
    // 2) Hence, find the data by using SELECT * FROM User-Product whiere id = 1;
    req.user.getProducts({ where: { id } })
    
    // 1) Without Associations: the result is only from the product table.
    // Product.findByPk(id)

        // here product itself is an instance of Product !!!***************
        .then(products => {

            const product = products[0];
            
            if(!product) res.redirect('/');
            
            res.render('admin/editProducts', {
                product,
                docTitle: 'Edit Product',
                path: '/admin/editProducts',
                // to differentiate getAddProduct
                editing: editMode
            });

        })

}

exports.postEditProduct = (req, res, next) => {

    const { id, title, imageUrl, description, price  } = req.body;
    if(!id || !title || !imageUrl || !description || !price) throw new Error('Invalid Input');
    
    // It is like findOne that returns instance.
    //  which is same as mongoose.
    
    // It is not required to associate user because we know the product id which is put in 'getEditProduct' 
    
    // Also, we do not need to use req.'user.getProducts()' here
    //  because it is from 'getEditProduct' above which is 
    //  arleady signed in.

    // Find the current, existing data and then edit them
    Product.findByPk(id)

        .then(product => {
            // const { id, title, price, imageUrl, description } = product;
            product.id = id;
            product.title = title;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description; 

            // here 'product' is an instance of Product.
            return product.save();
        }).then(() => {
            console.log('Successfully Updated!');
            res.redirect('/admin/products');
        }).catch(e => {console.log(e)});

}

// to get all data and render data to /admin/products and then to /admin/products ejs file
exports.getProducts = (req, res, next) => {

    // With Associations
    // Just need to get user's products, not all users' products
    // 2)
    req.user.getProducts()
        .then(products => {

            res.render('admin/products', {
                products,
                docTitle: 'Admin Products',
                path: '/admin/products'
            });

        })
        .catch(e => { console.log(e)});

    // // With sequelize
    // 1)
    // Product.findAll()
    //     .then(products => {
    //         res.render('admin/products', {
    //             products,
    //             docTitle: 'Admin Products',
    //             path: '/admin/products'
    //         });
    //     })
    //     .catch(e => { console.log(e)});

    // With the json file
    // Product.fetchAll(products => {

    //     res.render('admin/products', { 
    //         products, 
    //         docTitle: 'Admin Products', 
    //         path: '/admin/products'
      
    //     });

    // });

}

// Once delete here, that product is deleted all associated tables 
//  because it follows the cascade.
exports.deleteProduct = (req, res, next) => {
    const { id } = req.body;

    // With sequelize: destroy() 
    // It works but in the business logic point of view,
    
    //  it is more clear to use req.user.getProducts.
    req.user.getProducts({ where: { id }})
    // Product.findByPk(id)
        .then(products => {
            const product = products[0];

            // must use a single instance.
            return product.destroy();
        })
        .then(() => {
            res.redirect('/admin/products');
            console.log(`Delete ${product.title} out of the database`);
        })
        .catch(e => { console.log(e)});

    // Only with a json file
    // Product.deleteById(id);

}