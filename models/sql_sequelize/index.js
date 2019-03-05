const Product = require('./product');
const User = require('./user');
const Cart = require('./cart');
const CartItems = require('./cart_items');
const Order = require('./order');
const OrderItems = require('./order-items');


// [Association]
// Before all the models are up by 'sequelize.sync()', we need to define associations
// 'onDelete: 'CASCADE' (Option): If the USER deletes, products will be gone, as well.

/*  
    ASSOCIATION is set in console window.
    userId` INTEGER, PRIMARY KEY (`id`), FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB; */

// [
        // [ One-to-Many Association ]: Rule of thumb, Product table shoud store the joining reference.
        
        // One product has only many users.
        Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

        // (hasMany : one to many association)
        /* 

            hasMany is used in a One To Many relationship 
                while belongsToMany refers to a Many To Many relationship.
            They are both distinct relationship types and each require 
            a different database structure - thus they take different parameters.
        
        */
        // A user has many Products
        // automatically user.set/get/createProdutct()
        User.hasMany(Product);

// ]

// [
        
        // [One to One Association ] : rule of thumb here, Cart table has the User reference.

        // A cart has only one User        
        Cart.belongsTo(User);
    
        // A user has only one Cart.
        // protoType.user= set/get/createCart()
        User.hasOne(Cart);

// ]

// [

        // [ Many to Many Association ]
        // A foreign key pair is a primary key.
        // ************IMPORTANT
        // In a many-to-many relation, neither of tables can take the reference (a foreign key).
        // because each table belongs to the counter partner.
        // In this many to many relation, the third table is required to be created to reference.
        //  Hence, from this table, we can query association data.
        //  product.getCarts / cart.getProducts

        // A cart has many Products
        // The third table here is created by using CartItems model.
        // product.get/set/addCarts() and addCart()
        Cart.belongsToMany(Product, { through: CartItems });

        // A product has many Carts
        // cart.get/set/addProducts() and addProduct()
        Product.belongsToMany(Cart, { through: CartItems });

// ]

// [
        
        Order.belongsTo(User);
        User.hasMany(Order);

        Order.belongsToMany(Product, { through: OrderItems });
        Product.belongsToMany(Order, { through: OrderItems });

// ]

