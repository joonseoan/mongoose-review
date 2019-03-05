const Sequelize = require('sequelize');
const { INTEGER, STRING } = Sequelize;

const sequelize = require('../utils/database');

// Product and Cart Associations (Many to Many)
const CartItems = sequelize.define('cartItems', {
    id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    qty: {
        type: INTEGER
    }
});

module.exports = CartItems;