const fs = require('fs');
const path = require('path');

const filePath = path.join(path.dirname(process.mainModule.filename), 'data', 'carts.json');

module.exports = class Cart {

    static addProduct(id, productPrice) {
    
        // Fetch the previous cart
        fs.readFile(filePath, (err, res) => {

            let updatedProduct;
            
            // cart: {"products":[{"id":"0.9675189185981483","qty":2},{"id":"0.9818511377216477","qty":1}],"totalPrice":390.98}
            let cart = { products: [], totalPrice: 0 };
            
            if(!err) {

                // JSON.parse() is a must-have first step to read a file-based database
                cart = JSON.parse(res);
            }
            
            const existingProductIndex = cart.products.findIndex(product => product.id === id);
            
            console.log('existingProductIndex from findIndex(): ', existingProductIndex); // => 0 
            
            const existingProduct = cart.products[existingProductIndex];

            if(existingProduct) {

                updatedProduct = { ...existingProduct };
                
                updatedProduct.qty = updatedProduct.qty + 1;

                cart.products[existingProductIndex] = updatedProduct;

            } else {

                updatedProduct = { id, qty: 1};

                // *********************** Deep Clone!!!!
                cart.products = [ ...cart.products, updatedProduct ];

            }

            // +productPrice :  type (String -> Number)
            cart.totalPrice = cart.totalPrice + +productPrice;  
            
            fs.writeFile(filePath, JSON.stringify(cart), err => {
                console.log(err);
            });

        });

    }

    static deleteProduct(id, price) {

        fs.readFile(filePath, (err, res) => {

            if(err) {
                return;
            }

            const updatedCart = { ...JSON.parse(res) };
            
            const product = updatedCart.products.find(product => product.id === id);
            
            if(!product) {
                return;
            }
            
            //
            const prodcutQty = product.qty;
            
            // to remove the product from the array
            updatedCart.products = updatedCart.products.filter(product => product.id !== id);
            
            updatedCart.totalPrice = updatedCart.totalPrice - (price * prodcutQty);

            fs.writeFile(filePath, JSON.stringify(updatedCart), err => {
                console.log(err);
            })
        });
    }   

    static getCart(callback) {
        fs.readFile(filePath, (err, res) => {
            const productsInCart = JSON.parse(res);
            if(err) {
                // undefined: noting to show
                callback(null);
            } else {
                callback(productsInCart);
            }
        });
    }

}