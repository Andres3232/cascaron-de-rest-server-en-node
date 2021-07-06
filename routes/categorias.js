const { Router  } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, tieneRole, esAdminRole } = require('../middlewares');
const { crearCategoria, categoriasGet, obtenerCategoriaId, actualizarCategoria,borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');




const router = Router();

//obtener todas las categorias - publico
router.get('/', categoriasGet);

//obtener una categoria por id-publico
router.get('/:id',[
    check('id','No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], obtenerCategoriaId);

//crear categoria -privado-cualquier persoan conn un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//aactualizar=privado-cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoria ),
    validarCampos
] ,actualizarCategoria);

//borrar unna categoria= admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoria ),
] ,borrarCategoria)




module.exports = router;