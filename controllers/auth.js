const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async ( req, res = response ) => {

    const { email, name, password } = req.body;

    try {
        
        // Verificar email.
        const usuario = await Usuario.findOne({ email });
        if( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya está en uso.'
            });
        }

        // Crear usuario con el modelo.
        const dbUser = new Usuario( req.body );

        // Hashear la contraseña.
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );

        // Generar el JWT (JSON Web Token).
        const token = await generarJWT( dbUser.id, name );

        // Crear usuario de base de datos.
        await dbUser.save();

        // Generar respuesta exitosa.
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            email,
            name,
            token
        });

        
    } catch ( error ) {
        console.log( error );
        return res.status(500).json({
            ok: flase,
            msg: 'Por favor, hable con el administrador.'
        });
    }

}

const loginUsuario = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {

        // Comprobar si el correo hace match.

        const dbUser = await Usuario.findOne({ email });

        if( !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe.'
            });
        }

        // Comprobar si la contraseña hace match.

        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if( !validPassword ) {
            return res.status(400).json({
                ok: false, 
                msg: 'La contraseña no es válida.'
            });
        }

        // Generar el JWT.

        const token = await generarJWT( dbUser.id, dbUser.name );

        // Respuesta del servidor.

        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        });

    } catch ( error ) {
        console.log( error );
        return res.status( 500 ).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }

}

const revalidarToken = async ( req, res = response ) => {

    const { uid } = req;

    // Leer la base de datos.
    const dbUser = await Usuario.findById( uid );

    // Generar nuevo JWT. 
    const token = await generarJWT( uid, dbUser.name );

    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });
    
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}