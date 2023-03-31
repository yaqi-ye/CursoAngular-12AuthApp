
const { Router } = require('express');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { check } = require('express-validator');

const router = Router();

// Crear un nuevo usuario.
router.post( '/new', crearUsuario );

// Login de usuario.
router.post( '/', [
    check( 'email', 'El email es obligatorio.' ).isEmail(),
    check( 'password', 'La contraseña es obligatoria.' ).isLength( { min: 6 } )
], loginUsuario );

// Validar y revalidar token.
router.get( '/renew', revalidarToken );

module.exports = router;