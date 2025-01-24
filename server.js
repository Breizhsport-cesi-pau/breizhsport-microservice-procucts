require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/database');
const app = require("./app");
const PORT = process.env.PORT;

sequelize.sync({ alter: true })
    .then(() => console.log('Base de données synchroniséeee'))
    .catch(err => console.error('Erreur lors de la synchronisation :', err));

app.listen(PORT, () => {
    console.log(`Service de gestion des produit sur http://localhost:${PORT}`);
});
