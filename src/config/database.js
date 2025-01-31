const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connexion réussie à la base de données.');

        await sequelize.sync({ alter: true }); // Assure la mise à jour des modèles
        console.log('✅ Modèles synchronisés.');

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de l\'app :', error);
    }
})();

module.exports = sequelize;