const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Variant = require('./Variant');

const Picture = sequelize.define('Picture', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    id_variant: {
        type: DataTypes.CHAR(36),
        allowNull: false, // Une photo doit toujours être associée à un variant
        references: {
            model: Variant, // Référence au modèle `Variant`
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Supprime les photos si le variant est supprimé
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false, // L'URL de la photo est obligatoire
    },
}, {
    tableName: 'Pictures',
    timestamps: true,
});

module.exports = Picture;
