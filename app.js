require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.json());

const productRoutes = require('./src/routes/productRoutes');
const variantRoutes = require('./src/routes/variantRoutes');
const categorieRoutes = require('./src/routes/categorieRoute');
const productsCategoriesRoutes = require('./src/routes/productsCategoriesRoutes');
const pictureRoute = require('./src/routes/picturesRoute');

app.get('/healthcheck', (req, res) => {
    res.status(200).send('ok');
});
app.use('/categories', categorieRoutes);
app.use('/variants', variantRoutes);
app.use('/products', productRoutes);
app.use('/products-categories', productsCategoriesRoutes);
app.use('/pictures',pictureRoute);


module.exports = app;