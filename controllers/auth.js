const bcryptjs = require('bcryptjs');

const { generarJWT } = require('../helpers/generarJWT');
const Usuario = require('../models/usuario');



const login = async(req, res  )  => {

    const { correo, password } = req.body;

    try {

        //VERIFICAR SI EL EMIAL EXISTE
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - correo'
            });
        }

        //SI EL USUARIO ESTA ACTIVO
        if(!usuario.estado){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - estado: false'
            });
        }

        //VERIFICAR EL PASSWORD
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if(!validPassword){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - password'
            });
        }


        //GENERAR EL JWT
        const token = await generarJWT ( usuario.id );
        
        res.json ({
            usuario,
            token
    
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el admin'
        });
        
    }



}


module.exports = {
    login
}