const Categorie = require('../models/Categorie');

// Récupérer tous les produits
exports.getAllCategories = async (req, res) => {
    try {
        const categorie = await Categorie.findAll();
        res.json(categorie);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des Categories' });
    }
};

// Récupérer un Categorie par ID
exports.getCategoriesById = async (req, res) => {
    const { id } = req.params;
    try {
        const categorie = await Categorie.findByPk(id);
        if (!categorie) {
            return res.status(404).json({ error: 'Categorie non trouvé' });
        }
        res.json(categorie);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du categorie'});
    }
};

// Créer un nouvel Categorie
exports.createCategorie = async (req, res) => {
    const { name } = req.body;
    try {
        const newCategorie = await Categorie.create({ name });
        res.status(201).json({ message: 'Categorie créé', product: newCategorie });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la Categorie' });
    }
};

// Modifier un produit
exports.updateCategorie = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const categorie = await Categorie.findByPk(id);
        if (!categorie) {
            return res.status(404).json({ error: 'Categorie non trouvé' });
        }

        categorie.name = name || categorie.name;

        await categorie.save();

        res.json({ message: 'Categorie mis à jour', categorie });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la Categorie' });
    }
};

// Supprimer une Categorie
exports.deleteCategorie = async (req, res) => {
    const { id } = req.params;
    try {
        const categorie = await Categorie.findByPk(id);
        if (!categorie) {
            return res.status(404).json({ error: 'categorie non trouvé' });
        }

        await categorie.destroy();

        res.json({ message: 'categorie supprimé' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression dde la categorie' });
    }
};
