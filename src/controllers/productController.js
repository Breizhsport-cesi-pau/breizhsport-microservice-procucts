const { Op } = require('sequelize');
const GLOBAL = require("../utils/helpers");
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
                size: variant.size,
                color: variant.color,
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
                size: variant.size,
                color: variant.color,
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
    const { name, description, categorys, variants } = req.body;

    console.log("createProduct", req.body)
    try {
        const newProduct = await Product.create({ name, description });

        if (categorys && categorys.length > 0) {
            console.log("categorys", categorys)
            for (const category of categorys) {
                await ProductsCategories.create({ id_categorie: category, id_product: newProduct.id });
            }
        }

        if (variants && variants.length > 0) {
            for (const variant of variants) {
                await Variant.create({ ...variant, id:GLOBAL.generateGUID(),id_product: newProduct.id });
            }
        }

        res.status(201).json({ message: 'Produit créé', product: newProduct });
    } catch (error) {
        console.error('Erreur lors de la création du produit :', error);
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

