
const { Producto } = require('../models');
const categoria = require('../models/categoria');





//Crear producto
const crearProducto = async ( req, res ) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne ({ nombre:body.nombre });

    if (productoDB) {
        return res.status(400).json({
            msg:`El producto ${ productoDB.nombre }, ya existe`
        });
    }

    // generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data )

    //guardar en DB
    await producto.save();

    res.status(201).json(producto);
}   


//obtener productos

const productosGet = async ( req, res ) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const[ total, producto ] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
                .populate( 'usuario','nombre' )
                .skip( Number(desde) )
                .limit( Number(limite) ) 
    ]);

    res.json({
        total,
        producto
    })
}

const obtenerProductoId = async ( req, res ) => {

    const { id } = req.params;
    const producto = await Producto.findById( id ).populate('usuario','nombre').populate('categoria','nombre');
    if(!producto.estado){
        return res.status(400).json({
            msg:`el prodcuto ${producto.nombre} esta dado de baja`
        })    
    } else{
        res.json({
            producto
        })
    }

}

const actualizarProducto = async ( req, res ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id,data, {new: true});

    res.json(producto)

}
 
const borrarProducto = async(req, res) => {

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {disponible: false}, {new:true});

    res.json(producto)



}




module.exports = {
    crearProducto,
    productosGet,
    obtenerProductoId,
    actualizarProducto,
    borrarProducto
    
}