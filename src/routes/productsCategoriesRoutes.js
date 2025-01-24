// Routes pour ProductsCategories
const express = require('express');
const router = express.Router();
const productsCategoriesController = require('../controllers/productsCategoriesController');
const Global = require('../utils/helpers')

// Récupérer toutes les relations produits-catégories
router.get('/', productsCategoriesController.getAllProductsCategories);

// Récupérer une relation produit-catégorie par ID
router.get('/:id', productsCategoriesController.getProductCategoryById);

// Créer une nouvelle relation produit-catégorie
router.post('/', Global.authenticateToken, productsCategoriesController.createProductCategory);

// Mettre à jour une relation produit-catégorie
router.put('/:id', Global.authenticateToken, productsCategoriesController.updateProductCategory);

// Supprimer une relation produit-catégorie
router.delete('/:id', Global.authenticateToken, productsCategoriesController.deleteProductCategory);

module.exports = router;
