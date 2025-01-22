const express = require('express');
const router = express.Router();
const photoController = require('../controllers/picturesController');

// Récupérer toutes les photos d'un variant
router.get('/variant/:id_variant', photoController.getPicturesByVariant);

// Ajouter une nouvelle photo
router.post('/', photoController.addPicture);

// Supprimer une photo
router.delete('/:id', photoController.deletePicture);

module.exports = router;
