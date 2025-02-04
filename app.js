require( 'dotenv' ).config();
const express = require( 'express' );
const cors = require( "cors" )
const app = express();
app.use( cors( {
    origin: '*'
} ) )
// Middleware pour le parsing JSON
app.use( express.json() );
// Importation des routes
const productRoutes = require( './src/routes/productRoutes' );
const variantRoutes = require( './src/routes/variantRoutes' );
const categorieRoutes = require( './src/routes/categorieRoute' );
const productsCategoriesRoutes = require( './src/routes/productsCategoriesRoutes' );
const pictureRoute = require( './src/routes/picturesRoute' );

// Route de vérification du service
app.get( '/healthcheck', ( req, res ) => {
    res.status( 200 ).send( 'ok' );
} );

// Déclaration des routes
app.use( '/categories', categorieRoutes );
app.use( '/variants', variantRoutes );
app.use( '/products', productRoutes );
app.use( '/products-categories', productsCategoriesRoutes );
app.use( '/pictures', pictureRoute );
app.use( '/pictures', express.static( 'static/pictures' ) )
module.exports = app;
