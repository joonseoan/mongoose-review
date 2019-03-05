const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    user : {
        username: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    products : [{
        productData: {
            type: Object,
            required: true
        }
    }]
    
});

module.exports = mongoose.model('Order', orderSchema);
