const Sequelize = require('sequelize');
const { INTEGER, STRING, DOUBLE } = Sequelize;

const sequelize = require('../utils/database');

// connect pool by using sequelize
// Then, define and create a table which is named 'product' here.

// Finlly, it will define the table to be 'Product class' here with this attributes
//      this { id, title, price, imageUrl, description  }
const Product = sequelize.define('product', {
    id: {
        type: INTEGER,

        // we can find a bunch of this kind of attributes in sequelize doc.
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: STRING,
        allowNull: false,      
    },
    price : {
        type: DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: STRING,
        allowNull: false
    },
    description: {
        type: STRING,
        allowNull: false
    }
});

module.exports = Product;

// only with mysql2 lib
// const db = require('../utils/database');

// // import cart model to delete
// const Cart = require('./cart');

// module.exports = class Product {
    
//     constructor(id, title, imageUrl, description, price) {

//         this.id = id;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }

//     // Insert
//     save() {

//         return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)', 
//         [this.title, this.price, this.description, this.imageUrl]
//         );

//     }

//     static fetchAll() {

//         // return is required to get async of promise
//         return db.execute('SELECT * FROM products');
        

//     }

//     static deleteById(id) {

//     }

//     static findProductById(id){

//         return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
       
//     }

// }