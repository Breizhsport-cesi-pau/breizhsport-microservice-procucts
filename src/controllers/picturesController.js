const Picture = require('../models/Picture');

// Récupérer toutes les photos d'un variant
exports.getPicturesByVariant = async (req, res) => {
    const { id_variant } = req.params;
    try {
        const pictures = await Picture.findAll({ where: { id_variant } });
        if (!pictures || pictures.length === 0) {
            return res.status(404).json({ error: 'Aucune photo trouvée pour ce variant' });
        }
        res.json(pictures);
    } catch (error) {
        console.error('Erreur lors de la récupération des photos :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des photos' });
    }
};

// Ajouter une photo à un variant
exports.addPicture = async (req, res) => {
    const { id_variant, url } = req.body;
    try {
        const newPicture = await Picture.create({ id_variant, url, description });
        res.status(201).json({ message: 'Photo ajoutée avec succès', picture: newPicture });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la photo :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la photo' });
    }
};

// Supprimer une photo
exports.deletePicture = async (req, res) => {
    const { id } = req.params;
    try {
        const picture = await Picture.findByPk(id);
        if (!picture) {
            return res.status(404).json({ error: 'Photo non trouvée' });
        }
        await picture.destroy();
        res.json({ message: 'Photo supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la photo :', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de la photo' });
    }
};
