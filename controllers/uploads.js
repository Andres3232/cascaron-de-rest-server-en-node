const { subirArchivo } = require("../helpers/");
const fs  = require('fs');
const path = require('path');


const { Usuario, Producto } = require('../models');



const cargarArchivo = async ( req, res ) => {
  

    //imagenes

    try {
      //const nombre = await subirArchivo( req.files,['txt','md'], 'textos');
      const nombre = await subirArchivo( req.files,undefined, 'imgs');

   
      res.json({nombre });
      
    } catch (msg) {
      res.status(400).json({msg});
    }
   
}

const actualizarImagen = async (req, res) => {



  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${ id }`
        });
      }
      
      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${ id }`
        });
      }
      
      break;
  
    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto'});
  }


  //Limpiar imgs previas
  if( modelo.img ) {
    //hay q borrar la iamgen del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if( fs.existsSync( pathImagen )) {
        fs.unlinkSync( pathImagen );
    }
  }

  const nombre = await subirArchivo( req.files,undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.json( modelo );

}

const mostrarImagen = async(req, res) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${ id }`
        });
      }
      
      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${ id }`
        });
      }
      
      break;
  
    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto'});
  }


  //Limpiar imgs previas
  if( modelo.img ) {
    //hay q borrar la iamgen del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if( fs.existsSync( pathImagen )) {
      return res.sendFile( pathImagen )
    }
  }

  const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile ( pathImagen)

}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}