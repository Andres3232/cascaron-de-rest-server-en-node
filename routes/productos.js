const { Router  } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, tieneRole, esAdminRole } = require('../middlewares');

const { existeProductoPorId, existeProducto } = require('../helpers/db-validators');
const { productosGet, crearProducto, obtenerProductoId, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { obtenerCategoriaId } = require('../controllers/categorias');




const router = Router();

//obtener todos los prodcutos - publico
router.get('/', productosGet);

//obtener una producto por id-publico

router.get('/:id',[
    check('id','No es un id de mongo valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], obtenerProductoId);


//crear categoria -privado-cualquier persoan conn un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de mongo').isMongoId(),
    //check('categoria').custom( existeProductoPorId ),
    validarCampos
], crearProducto);

//aactualizar=privado-cualquiera con token valido
router.put('/:id',[
    validarJWT,
    //check('categoria','No es un id de mongo').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
] ,actualizarProducto);

//borrar unna producto= admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom( existeProducto ),
] ,borrarProducto)




module.exports = router;