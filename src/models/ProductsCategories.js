const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductsCategories = sequelize.define('ProductsCategories', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    id_product: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_categorie: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'Products_Categories',
    timestamps: false, // Pas de createdAt ou updatedAt
});

module.exports = ProductsCategories;
