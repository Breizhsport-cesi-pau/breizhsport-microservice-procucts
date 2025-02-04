const multer = require( "multer" )
const { v4: uuidv4 } = require( "uuid" );
const path = require( 'node:path' );
const storage = multer.diskStorage( {
    destination: function ( req, file, cb ) {
        cb( null, path.join( process.cwd(), `/static/pictures/` ) )
    },
    filename: function ( req, file, cb ) {
        const uniqueSuffix = uuidv4()
        const fileExtention = file.originalname.split( "." ).at( -1 ) || "png"
        cb( null, `${ uniqueSuffix }.${ fileExtention }` )
    }
} )

const upload = multer( { storage: storage } )
module.exports = upload