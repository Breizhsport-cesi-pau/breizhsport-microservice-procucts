const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Categories = sequelize.define('Categories', {
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
}, {
    tableName: 'Categories',
    timestamps: true,
});

// Relation unidirectionnelle : Categories → ProductsCategories
Categories.hasMany(require('./ProductsCategories'), {
    foreignKey: 'id_categorie',
    as: 'categoryProducts',
});

module.exports = Categories;
