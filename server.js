require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/database');
const app = require("./app");

// Importation des modèles
const Product = require('./src/models/Product');
const Categorie = require('./src/models/Categorie');
const Variant = require('./src/models/Variant');
const Picture = require('./src/models/Picture');
const ProductsCategories = require('./src/models/ProductsCategories');

const PORT = process.env.PORT || 3002;

(async () => {
    try {
        // Connexion à la base de données
        await sequelize.authenticate();
        console.log('✅ Connexion réussie à la base de données.');

        // Synchronisation des modèles
        await sequelize.sync({ alter: true });
        console.log('✅ Base de données synchronisée.');

        // Vérification et seed de la base de données
        const seedDatabase = async () => {
            const productCount = await Product.count();
            if (productCount === 0) {
                console.log('🌱 No products found, seeding database...');
                await Product.bulkCreate([
                    {
                        id: 1,
                        name: 'tee-shirt',
                        description: 'tee-shirt en coton',
                    },
                ]);
            } else {
                console.log('✅ Products found, skipping seeding.');
            }

            const categorieCount = await Categorie.count();
            if (categorieCount === 0) {
                console.log('🌱 No categories found, seeding database...');
                await Categorie.bulkCreate([
                    {
                        name: 'Homme',
                    },
                ]);
            } else {
                console.log('✅ Categories found, skipping seeding.');
            }

            const variantCount = await Variant.count();
            if (variantCount === 0) {
                console.log('🌱 No variants found, seeding database...');
                await Variant.bulkCreate([
                    {
                        id: '5c3303ff-d4ac-11ef-977a-5254002b0e17',
                        id_product: 1,
                        size: 'M',
                        color: 'blue',
                        price: 10,
                        stock: 10,
                        name: 'tee-shirt bleu',
                    },
                ]);
            } else {
                console.log('✅ Variants found, skipping seeding.');
            }

            const pictureCount = await Picture.count();
            if (pictureCount === 0) {
                console.log('🌱 No pictures found, seeding database...');
                await Picture.bulkCreate([
                    {
                        id_variant: '5c3303ff-d4ac-11ef-977a-5254002b0e17',
                        url: 'https://th.bing.com/th/id/OIP.KQsOwCJsmvC22edRTRQaPwAAAA?w=156&h=181&c=7&r=0&o=5&dpr=1.3&pid=1.7',
                    },
                ]);
            } else {
                console.log('✅ Pictures found, skipping seeding.');
            }

            const productsCategoriesCount = await ProductsCategories.count();
            if (productsCategoriesCount === 0) {
                console.log('🌱 No product-category relations found, seeding database...');
                await ProductsCategories.bulkCreate([
                    {
                        id_product: 1,
                        id_categorie: 1,
                    },
                ]);
            } else {
                console.log('✅ Product-category relations found, skipping seeding.');
            }
        };

        await seedDatabase();

        // Démarrage du serveur
        app.listen(PORT, () => {
            console.log(`🚀 Service de gestion des produits en ligne sur http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
})();
