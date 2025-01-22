const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieContoller');

// Récupérer tous les utilisateurs
router.get('/', categorieController.getAllCategories);

// Récupérer un utilisateur par ID
router.get('/:id', categorieController.getCategoriesById);

// Créer un nouvel utilisateur
router.post('/', categorieController.createCategorie);

// Modifier un utilisateur
router.put('/:id', categorieController.updateCategorie);

// Supprimer un utilisateur
router.delete('/:id', categorieController.deleteCategorie);



module.exports = router;