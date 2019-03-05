// Without excutes the schema in app.js
//  we should import it, not use 'mongoose.model('Product');
const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {

    res.render('admin/editProducts', {
        docTitle: 'Add Products',
        path: '/admin/addProducts',
        editing: false
      
    });

}

exports.postAddProducts = (req, res, next) => {
    
    const { title, imageUrl, description, price } = req.body;
    // const userId = req.user._id;

    // In mongoose, we just need a parameter which is an object.
    // Important thing is in an object variable,
    //  the order is not matter.
    const product = new Product({
        // userId: req.user => only id is stored. because ref:'User' in schema
        title, price, description, imageUrl, userId: req.user
    });

    // MongoDB MODEL USES A JAVASCRIPT CLASS WITHOUT SCHEMA.
    //  THEREOFRE, WE NEED TO SPECIFY EVERY SINGLE ATTRIBURES.
    // THE PARAMETER ORDER IS A MATTER.
    // const product = new Product(title, imageUrl, description, price, null, userId);
    
    product.save()
        .then(() => {
            // It is a req data, not pure doc data.
            // console.log('result ======================================> ', result)
            console.log('Created Product');
            res.redirect('/admin/products');

        })
        .catch(e => console.log(e));

}

exports.getProducts = (req, res, next) => {
    //********************************************************* */
    Product.find()
        // for the current schema data
        // -_id ; remove _id
        // _id; put _id
        // .select('title price _id')
        // for reference data 
        // the first one is a data which is current schema
        // the seconde one is nested field which is from reference schema
        // .populate('userId', 'username')
        .then(products => {

            console.log(products)

            res.render('admin/products', {
                products,
                docTitle: 'Admin Products',
                path: '/admin/products'
            });

        })
        .catch(e =>  { throw new Error('Unable to get product list for admin.'); });

}

exports.getEditProduct = (req, res, next) => {

    console.log('req.query: ', req.query); // => req.query:  { edit: 'true', new: 'title' }

    // STRING, by the way
    const editMode = req.query.edit;

    if(!editMode) return res.redirect('/');

    const id = req.params.id;

    Product.findById(id)
        .then(product => {

            if(!product) res.redirect('/');

            res.render('admin/editProducts', {
                product,
                docTitle: 'Edit Product',
                path: '/admin/editProducts',
                editing: editMode
            });

        })
        .catch(e => { throw new Error('Unable to get the existing product. '); });

}

exports.postEditProduct = (req, res, next) => {

    const { title, imageUrl, description, price, id  } = req.body;
    if(!id || !title || !imageUrl || !description || !price) throw new Error('Invalid Input');

    // In mongoDB, we needed us class to update data
    //  then need to make a save method for both insertOne(this) and updateOne({ _id: this._id}, { $set: this})
    //  in terms of if this._id is availalbe.

    // In mongoose, it is a little different.
    Product.findById(id)
        // product: instance reference, not javacscript object like in mongoDB
        .then(product => {
            
            product.title = title;
            product.price = price;
            product.description = description;
            product.imageUrl = imageUrl;

            return product.save();
        })
        .then(() => {

            console.log('data is updated.');
            res.redirect('/admin/products');

        })
        .catch(e => { throw new Error('failed to update the product.'); });

}

exports.deleteProduct = (req, res, next) => {
    const { id } = req.body;

    // in mongoDB: DB.deleteOne({ _id: new ObjectId(id) }

    // it is built in mongoose method. 
    Product.findByIdAndRemove(id)
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(e => { throw new Error('Unable to delete the product. '); });

}


// ---------------------------------------------------------- MongoDB
// const Product = require('../models/product');

// exports.getAddProducts = (req, res, next) => {

//     res.render('admin/editProducts', {
//         docTitle: 'Add Products',
//         path: '/admin/addProducts',
//         editing: false
      
//     });

// }

// // to INSERT 'user input data' to the database
// exports.postAddProducts = (req, res, next) => {
    
//     const { title, imageUrl, description, price } = req.body;
//     const userId = req.user._id;

//     // null is for product id
//     const product = new Product(title, imageUrl, description, price, null, userId);
//     product.save()
//         .then(() => {
//             // It is a request data, not pure doc data.
//             // console.log('result ======================================> ', result)
//             console.log('Created Product');
//             res.redirect('/admin/products');

//         })
//         .catch(e => console.log(e));

// }

// exports.getProducts = (req, res, next) => {

//     Product.fetchAll()
//         .then(products => {

//             res.render('admin/products', {
//                 products,
//                 docTitle: 'Admin Products',
//                 path: '/admin/products'
//             });

//         })
//         .catch(e =>  { throw new Error('Unable to get product list for admin.'); });

// }

// exports.getEditProduct = (req, res, next) => {

//     console.log('req.query: ', req.query); // => req.query:  { edit: 'true', new: 'title' }

//     // STRING, by the way
//     const editMode = req.query.edit;

//     if(!editMode) return res.redirect('/');

//     const id = req.params.id;

//     Product.findById(id)
//         .then(product => {

//             if(!product) res.redirect('/');

//             res.render('admin/editProducts', {
//                 product,
//                 docTitle: 'Edit Product',
//                 path: '/admin/editProducts',
//                 editing: editMode
//             });

//         })
//         .catch(e => { throw new Error('Unable to get the existing product. '); });

// }

// exports.postEditProduct = (req, res, next) => {

//     const { title, imageUrl, description, price, id  } = req.body;
//     if(!id || !title || !imageUrl || !description || !price) throw new Error('Invalid Input');

//     new Product(
//         title,
//         imageUrl,
//         description,
//         price,
//         id    
//     )
//     .save()
//     .then(() => {

//         console.log('Data is updated!!!')
//         res.redirect('/admin/products');

//     })
//     .catch(e => { throw new Error('Unable to update!'); });
    
// }

// exports.deleteProduct = (req, res, next) => {
//     const { id } = req.body;

//     Product.deleteById(id)
//         .then(() => {
//             res.redirect('/admin/products');
//         })
//         .catch(e => { throw new Error('Unable to delete the product. '); });

// }