const { Categoria } = require("../models");


//obtenerr categorias-paginado-total-populate

const categoriasGet = async (req, res) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categoria ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
                 .populate('usuario', 'nombre')
                 .skip( Number(desde) )
                 .limit( Number(limite))   

    ]);

    res.json({
        total,
        categoria
    })
}


//obtenerr categoria populate
const obtenerCategoriaId = async ( req, res ) => {
    
    const { id } = req.params;

    const categoria =  await Categoria.findById( id ).populate('usuario','nombre')
    if(!categoria.estado){
        return res.status(400).json({
            msg:`la categoria ${categoria.nombre} esta dada de bajo`
        })
    } else{
        
        res.json({
            categoria
        })
    }



}

const crearCategoria = async ( req, res ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    //generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria( data );

    //guardar en DB
    await categoria.save();

    res.status(201).json(categoria);
}

//actualizrCategoria

const actualizarCategoria = async ( req, res ) => {

    const  id  = req.params.id;
    const{ estado, usuario, ...data } = req.body

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true })

    res.json (categoria)




}


//BorrarCategoria-estado:false

const borrarCategoria = async(req, res) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new:true});

    res.json(categoria)



}



module.exports = {
    crearCategoria,
    categoriasGet,
    obtenerCategoriaId,
    actualizarCategoria,
    borrarCategoria
}