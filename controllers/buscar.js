

const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async( termino = '', res ) => {

    const esMongoID = ObjectId.isValid( termino );

    //buscar por id
    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: { usuario }
                        ? [ usuario ]
                        : []
        })
    }

    //buscar por nombre
    const regex = new RegExp( termino, 'i') //expresion regular para q sea insensible el nombre del usuario
    const usuarios = await Usuario.find({ 
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
     });

    res.json({
        results: usuarios
    })

}


const buscarCategorias = async( termino = '', res ) => {

    const esMongoID = ObjectId.isValid( termino );

    //buscar por id
    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: { categoria }
                        ? [ categoria ]
                        : []
        })
    }

    //buscar por nombre
    const regex = new RegExp( termino, 'i') //expresion regular para q sea insensible el nombre del usuario
    const categorias = await Categoria.find({ nombre: regex, estado: true});

    res.json({
        results: categorias
    })

}


const buscarProductos = async( termino = '', res ) => {

    const esMongoID = ObjectId.isValid( termino );

    //buscar por id
    if ( esMongoID ) {
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            results: { producto }
                        ? [ producto ]
                        : []
        })
    }

    //buscar por nombre
    const regex = new RegExp( termino, 'i') //expresion regular para q sea insensible el nombre del usuario
    const productos = await Producto.find({ nombre: regex, estado: true}).populate('categoria','nombre');

    res.json({
        results: productos
    })

}




const buscar = async (req, res) => {

    const { coleccion,termino} = req.params

    if( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg:`Las colleciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
       case  'usuarios':
        buscarUsuarios(termino, res);
           break;
        case 'categorias':
            buscarCategorias(termino, res);

            break;
        case 'productos':
            buscarProductos(termino, res);

            break;
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            })
    }


}



module.exports = {
    buscar
}