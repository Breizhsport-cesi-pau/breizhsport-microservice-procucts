const express = require('express');
const router = express.Router();
const variantController = require('../controllers/variantController');
const Global = require('../utils/helpers')


router.get('/', variantController.getAllVariants);

router.get('/:id', variantController.getVariantsById);

router.post('/', Global.authenticateToken, variantController.createVariant);

router.put('/:id', Global.authenticateToken, variantController.updateVariant);

router.delete('/:id', Global.authenticateToken, variantController.deleteVariant);

module.exports = router;