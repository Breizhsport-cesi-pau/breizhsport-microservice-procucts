const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'Products',
    timestamps: true,
});

// Relation unidirectionnelle : Product → ProductsCategories
Product.hasMany(require('./ProductsCategories'), {
    foreignKey: 'id_product',
    as: 'productCategories',
});

module.exports = Product;
