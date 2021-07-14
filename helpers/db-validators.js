
const Role = require('../models/role');
const {Usuario, Categoria,Producto} = require('../models');



const esRoleValido = async (rol='') =>{

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no esta registrdo en la DB`)
    }
}

const emailExiste = async (correo='') => {

    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`el correoo: ${ correo }, ya esta registrado`)
    }
}

const existeUsuarioPorId = async ( id ) => {

    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
//CATEGORIA VALIDADORES
const existeCategoria = async ( id ) => {

    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


//PRODUCTO VALIDACIONES
const existeProductoPorId = async ( id ) => {

    const existeProducto= await Producto.findById(id);
    if ( !existeProducto) {
        throw new Error(`El id no existe ${ id }`);
    }
}

const existeProducto = async ( id ) => {

    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

//validar las colleciones permitidas

const coleccionesPermitidas = (coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes ( coleccion )

    if ( !incluida ){
        throw new Error ( `La collecion ${coleccion} no es permitida`)

    }
    return true
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProductoPorId,
    existeProducto,
    coleccionesPermitidas
}
