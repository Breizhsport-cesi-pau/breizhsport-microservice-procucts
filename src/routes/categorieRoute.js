const express = require( 'express' );
const router = express.Router();
const categorieController = require( '../controllers/categorieContoller' );
const Global = require( '../utils/helpers' )

// Récupérer tous les utilisateurs
router.get( '/', categorieController.getAllCategories );

// Récupérer un utilisateur par ID
router.get( '/:id', categorieController.getCategoriesById );

// Créer un nouvel utilisateur
router.post( '/', Global.authenticateToken, categorieController.createCategorie );

// Modifier un utilisateur
router.put( '/:id', Global.authenticateToken, categorieController.updateCategorie );

// Supprimer un utilisateur
router.delete( '/:id', Global.authenticateToken, categorieController.deleteCategorie );



module.exports = router;