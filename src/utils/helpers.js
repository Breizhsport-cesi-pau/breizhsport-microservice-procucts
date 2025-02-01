const jwt = require( 'jsonwebtoken' )
const fs = require( 'fs' )
const path = require( 'path' )

const publicKey = fs.readFileSync( path.join( './', 'keys', 'rsa.key.pub' ), 'utf8' )


function generateGUID () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
        const r = ( Math.random() * 16 ) | 0;
        const v = c === 'x' ? r : ( r & 0x3 ) | 0x8;
        return v.toString( 16 );
    } );
}

const authenticateToken = ( req, res, next ) => {
    // Récupérer le token dans l'en-tête Authorization
    const authHeader = req.headers[ 'authorization' ];
    const token = authHeader && authHeader.split( ' ' )[ 1 ];

    if ( !token ) {
        return res.status( 401 ).json( { error: 'Accès interdit : token manquant' } );
    }

    // Vérifier et décoder le token
    jwt.verify( token, publicKey, ( err, user ) => {
        if ( err ) {
            return res.status( 403 ).json( { error: 'Token invalide ou expiré' } );
        }

        // Ajouter les données du token (payload) à req.user
        req.user = user;
        next(); // Passer au middleware ou à la route suivante
    } );
};

module.exports = {
    generateGUID,
    authenticateToken,
};