const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const { INTEGER } = Sequelize;

const OrderItems = sequelize.define('orderItems', {
    
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

module.exports = OrderItems;