const fs = require('fs');
const path = require('path');

const filePath = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

exports.getProductsFromFile = (callback) => {
        
    fs.readFile(filePath, (err, res) => {

        // no products.json exists or any other errors that is not able to read the file
        if(err) {

            // at least return an empty array for now temporarily
            return callback([]);

        } else {

            // change the Joson format to an object format then return
            callback(JSON.parse(res)); // the current array
        }
        
    });

}