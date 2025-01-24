const express = require('express');
const router = express.Router();
const photoController = require('../controllers/picturesController');
const Global = require('../utils/helpers')

// Récupérer toutes les photos d'un variant
router.get('/variant/:id_variant', photoController.getPicturesByVariant);

// Ajouter une nouvelle photo
router.post('/', Global.authenticateToken, photoController.addPicture);

// Supprimer une photo
router.delete('/:id', Global.authenticateToken, photoController.deletePicture);

module.exports = router;
