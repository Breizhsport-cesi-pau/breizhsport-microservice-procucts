const { Op } = require('sequelize');
const Product = require('../models/Product');
const Categories = require('../models/Categorie');
const ProductsCategories = require('../models/ProductsCategories');
const Variant = require('../models/Variant');
const Picture = require('../models/Picture');


exports.getLatest = async (req, res) => {
    console.log("getLatest")
    const { page = 1, pageSize = 5 } = req.query; 
    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    try {
        const products = await Product.findAll({
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });
        console.log(products);
        res.json(products);
    } catch (error) {
        console.error('Erreur lors de la récupération des derniers produits :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des derniers produits' });
    }
};

exports.getProductByName = async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: 'Le paramètre "name" est requis' });
    }

    try {
        const products = await Product.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`, // Recherche partielle par nom
                },
            },
        });

        if (products.length === 0) {
            return res.status(404).json({ error: 'Aucun produit trouvé' });
        }

        res.json(products);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits par nom :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des produits par nom' });
    }
};

// Récupérer tous les produits
exports.getAllProducts = async (req, res) => {
    const { page = 1, pageSize = 5, name, categoryId } = req.query;

    const limit = Math.max(1, parseInt(pageSize, 10) || 5);
    const offset = Math.max(0, (parseInt(page, 10) - 1) * limit);

    const whereConditions = {};
    if (name) {
        whereConditions.name = {
            [Op.like]: `%${name}%`,
        };
    }

    try {
        const products = await Product.findAll({
            where: whereConditions,
            include: [
                {
                    model: ProductsCategories,
                    as: 'productCategoryRelations',
                    include: {
                        model: Categories,
                        as: 'categorie',
                        ...(categoryId ? { where: { id: categoryId } } : {}),
                    },
                },
                {
                    model: Variant,
                    as: 'variants', // Alias défini dans `index.js`
                    include: [
                        {
                            model: Picture,
                            as: 'pictures', // Alias défini dans `index.js`
                        },
                    ],
                },
            ],
            limit,
            offset,
        });

        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'Aucun produit trouvé' });
        }

        const formattedProducts = products.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            categories: product.productCategoryRelations.map((relation) => ({
                id: relation.categorie.id,
                name: relation.categorie.name,
            })),
            variants: product.variants.map((variant) => ({
                id: variant.id,
                name: variant.name,
                price: variant.price,
                stock: variant.stock,
                pictures: variant.pictures.map((picture) => ({
                    id: picture.id,
                    url: picture.url,
                })),
            })),
        }));

        res.json(formattedProducts);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
};




// Récupérer un produit par ID
exports.getProductsById = async (req, res) => {
    console.log("getProductsById");
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: ProductsCategories,
                    as: 'productCategoryRelations',
                    include: {
                        model: Categories,
                        as: 'categorie',
                    },
                },
                {
                    model: Variant,
                    as: 'variants', // Alias défini dans `index.js`
                    include: [
                        {
                            model: Picture,
                            as: 'pictures', // Alias défini dans `index.js`
                        },
                    ],
                },
            ],
        });

        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        const formattedProduct = {
            id: product.id,
            name: product.name,
            description: product.description,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            categories: product.productCategoryRelations.map((relation) => ({
                id: relation.categorie.id,
                name: relation.categorie.name,
            })),
            variants: product.variants.map((variant) => ({
                id: variant.id,
                name: variant.name,
                price: variant.price,
                stock: variant.stock,
                pictures: variant.pictures.map((picture) => ({
                    id: picture.id,
                    url: picture.url,
                })),
            })),
        };

        res.json(formattedProduct);
    } catch (error) {
        console.error('Erreur lors de la récupération du produit :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
    }
};


// Créer un nouvel produit
exports.createProduct = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newProduct = await Product.create({ name, description });
        res.status(201).json({ message: 'Produit créé', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du produit' });
    }
};

// Modifier un produit
exports.updateProduct = async (req, res) => {
    console.log("updateProduct")
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        product.name = name || product.name;
        product.description = description || product.description;

        await product.save();

        res.json({ message: 'Produit mis à jour', product });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
    }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
    console.log("deleteProduct")
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        await product.destroy();

        res.json({ message: 'Produit supprimé' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
    }
};

exports.getProductsByCategory = async (req, res) => {
    const { id } = req.params; // L'ID de la catégorie à récupérer
    try {
        const category = await Categories.findByPk(id, {
            include: {
                model: ProductsCategories,
                as: 'categoryProducts', // Alias défini dans `models/index.js`
                include: {
                    model: Product,
                    as: 'product', // Alias défini dans ProductsCategories
                    attributes: ['id', 'name', 'description'], // Limitez les colonnes retournées
                },
            },
        });

        if (!category) {
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        }

        // Extraire les produits associés
        const products = category.categoryProducts.map((relation) => relation.product);

        res.json({
            category: {
                id: category.id,
                name: category.name,
            },
            products,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des produits par catégorie :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des produits par catégorie' });
    }
};

exports.getVariantsByProduct = async (req, res) => {
    console.log("getVariantsByProduct")
    const { id } = req.params; // ID du produit
    try {
        const product = await Product.findByPk(id, {
            include: {
                model: Variant, // Associez le modèle Variant
                as: 'variants', // Alias défini dans `models/index.js`
                attributes: ['id', 'name', 'price', 'stock'], // Limitez les colonnes retournées
            },
        });

        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        // Renvoyer les variants associés
        res.json({
            product: {
                id: product.id,
                name: product.name,
                description: product.description,
            },
            variants: product.variants, // Les variants associés au produit
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des variants par produit :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des variants' });
    }
};


