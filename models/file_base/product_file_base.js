const fs = require('fs');
const path = require('path');

const filePath = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
const { getProductsFromFile } = require('./services/fetchProducts');

// import cart model to delete
const Cart = require('./cart');

module.exports = class Product {
    
    constructor(id, title, imageUrl, description, price) {

        this.id = id;

        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {

        getProductsFromFile(products => {
            
            if(this.id) {
                const existingProductIndex = products.findIndex(product => this.id === product.id);
                const updatedProducts = [ ...products ];

                // deep clone and save are required because it changed element's field value ****.
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                });
                
            // In order to put a new product just created.
            } else {
                this.id = Math.random().toString();                   
                products.push(this);
                fs.writeFile(filePath, JSON.stringify(products), (err) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                });
            }
            
        });
        
    }

    static fetchAll(callback) {

        getProductsFromFile(callback);

    }

    // making new products.json data that the data with this "id" is not availabe
    static deleteById(id) {
        getProductsFromFile(products => {

            // to find price from the identified element
            const product = products.find(product => product.id === id);

            // 2) to delete the identified elelment by using filter
            const updatedProducts = products.filter(product => product.id !== id);

            fs.writeFile(filePath, JSON.stringify(updatedProducts), err => {

                // Then, overwrite 'data.json' by using a static method of Cart class
                if(!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });      
        });
    }

    static findProductById(id, callback){

        // first callback
        getProductsFromFile(products => {
            const product = products.find(product => product.id === id);

            callback(product);
        });
    }

}