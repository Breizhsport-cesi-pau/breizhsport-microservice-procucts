const { ProductsCategories, Product, Categories } = require('../models/index');

// Récupérer toutes les relations produits-catégories
exports.getAllProductsCategories = async (req, res) => {
    try {
        const productsCategories = await ProductsCategories.findAll({
            include: [
                { model: Product, as: 'product', attributes: ['id', 'name', 'description'] },
                { model: Categories, as: 'categorie', attributes: ['id', 'name'] },
            ],
        });
        res.json(productsCategories);
    } catch (error) {
        console.error('Erreur lors de la récupération des relations produits-catégories :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des relations' });
    }
};

// Récupérer une relation produit-catégorie par ID
exports.getProductCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const productCategory = await ProductsCategories.findByPk(id, {
            include: [
                { model: Product, as: 'product', attributes: ['id', 'name', 'description'] },
                { model: Categories, as: 'categorie', attributes: ['id', 'name'] }, // Correction des attributs de catégorie
            ],
        });
        if (!productCategory) {
            return res.status(404).json({ error: 'Relation produit-catégorie non trouvée' });
        }
        res.json(productCategory);
    } catch (error) {
        console.error('Erreur lors de la récupération de la relation produit-catégorie :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la relation' });
    }
};

// Créer une nouvelle relation produit-catégorie
exports.createProductCategory = async (req, res) => {
    const { id_product, id_categorie } = req.body; // Correction de `id_category`
    try {
        const newRelation = await ProductsCategories.create({ id_product, id_categorie });
        res.status(201).json({ message: 'Relation produit-catégorie créée', relation: newRelation });
    } catch (error) {
        console.error('Erreur lors de la création de la relation produit-catégorie :', error);
        res.status(500).json({ error: 'Erreur lors de la création de la relation' });
    }
};

// Mettre à jour une relation produit-catégorie
exports.updateProductCategory = async (req, res) => {
    const { id } = req.params;
    const { id_product, id_categorie } = req.body; // Correction de `id_category`
    try {
        const relation = await ProductsCategories.findByPk(id);
        if (!relation) {
            return res.status(404).json({ error: 'Relation produit-catégorie non trouvée' });
        }
        relation.id_product = id_product || relation.id_product;
        relation.id_categorie = id_categorie || relation.id_categorie;

        await relation.save();
        res.json({ message: 'Relation produit-catégorie mise à jour', relation });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la relation produit-catégorie :', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la relation' });
    }
};

// Supprimer une relation produit-catégorie
exports.deleteProductCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const relation = await ProductsCategories.findByPk(id);
        if (!relation) {
            return res.status(404).json({ error: 'Relation produit-catégorie non trouvée' });
        }
        await relation.destroy();
        res.json({ message: 'Relation produit-catégorie supprimée' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la relation produit-catégorie :', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de la relation' });
    }
};
