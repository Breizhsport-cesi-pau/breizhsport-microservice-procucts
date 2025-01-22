const Variant = require('../models/Variant');
const Product = require('../models/Product');
const Global = require('../utils/helpers');

// Récupérer toutes les variantes
exports.getAllVariants = async (req, res) => {
    try {
        const variants = await Variant.findAll({
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'description'],
            }],
        });

        res.json(variants);
    } catch (error) {
        console.error('Erreur lors de la récupération des variants:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des variants' });
    }
};

// Récupérer une variante par ID
exports.getVariantsById = async (req, res) => {
    const { id } = req.params;
    try {
        const variant = await Variant.findByPk(id, {
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'description'],
            }],
        });

        if (!variant) {
            return res.status(404).json({ error: 'Variant non trouvé' });
        }

        res.json(variant);
    } catch (error) {
        console.error('Erreur lors de la récupération du variant:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du variant' });
    }
};

// Créer un nouveau variant
exports.createVariant = async (req, res) => {
    const { id_product, size, color, price, stock, name } = req.body;
    const id = Global.generateGUID();
    try {
        const newVariant = await Variant.create({ id, id_product, size, color, price, stock, name });
        res.status(201).json({ message: 'Variant créé', variant: newVariant });
    } catch (error) {
        console.error('Erreur lors de la création du variant:', error);
        res.status(500).json({ error: 'Erreur lors de la création du variant' });
    }
};

// Modifier une variante
exports.updateVariant = async (req, res) => {
    const { id } = req.params;
    const { name, size, color, price, stock, id_product } = req.body;
    try {
        const variant = await Variant.findByPk(id);
        if (!variant) {
            return res.status(404).json({ error: 'Variant non trouvé' });
        }

        // Mise à jour des champs
        variant.name = name || variant.name;
        variant.size = size || variant.size;
        variant.color = color || variant.color;
        variant.price = price || variant.price;
        variant.stock = stock || variant.stock;
        variant.id_product = id_product || variant.id_product;

        await variant.save();

        res.json({ message: 'Variant mis à jour', variant });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du variant:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du variant' });
    }
};

// Supprimer une variante
exports.deleteVariant = async (req, res) => {
    const { id } = req.params;
    try {
        const variant = await Variant.findByPk(id);
        if (!variant) {
            return res.status(404).json({ error: 'Variant non trouvé' });
        }

        await variant.destroy();

        res.json({ message: 'Variant supprimé' });
    } catch (error) {
        console.error('Erreur lors de la suppression du variant:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression du variant' });
    }
};
