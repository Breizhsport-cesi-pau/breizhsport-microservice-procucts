// Routes pour ProductsCategories
const express = require('express');
const router = express.Router();
const productsCategoriesController = require('../controllers/productsCategoriesController');

// Récupérer toutes les relations produits-catégories
router.get('/', productsCategoriesController.getAllProductsCategories);

// Récupérer une relation produit-catégorie par ID
router.get('/:id', productsCategoriesController.getProductCategoryById);

// Créer une nouvelle relation produit-catégorie
router.post('/', productsCategoriesController.createProductCategory);

// Mettre à jour une relation produit-catégorie
router.put('/:id', productsCategoriesController.updateProductCategory);

// Supprimer une relation produit-catégorie
router.delete('/:id', productsCategoriesController.deleteProductCategory);

module.exports = router;
