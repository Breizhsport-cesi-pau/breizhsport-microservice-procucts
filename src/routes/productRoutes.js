const express = require( 'express' );
const router = express.Router();
const productController = require( '../controllers/productController' );
const Global = require( '../utils/helpers' );
const upload = require( '../config/multer' );

// Récupérer tous les utilisateurs
router.get( '/', productController.getAllProducts );

router.get( '/latest', productController.getLatest );



// Récupérer un utilisateur par ID
router.get( '/:id', productController.getProductsById );

// Créer un nouvel utilisateur
router.post( '/', upload.any(), productController.createProduct );

// Modifier un utilisateur
router.put( '/:id', Global.authenticateToken, productController.updateProduct );

// Supprimer un utilisateur
router.delete( '/:id', Global.authenticateToken, productController.deleteProduct );





module.exports = router;