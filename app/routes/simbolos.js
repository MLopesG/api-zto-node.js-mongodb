const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const controllerSimbolos = require('../controllers/simbolosController.js');

router.get('/info/:idCategoria', controllerSimbolos.view);

router.get('/listar/:idCategoria', controllerSimbolos.subCategorias);

router.get('/', controllerSimbolos.view);

router.put('/edit/:id',
	[
		check('descricaoSimbolo', 'Texto descritivo é obrigatório').not().isEmpty(),
		check('idCategoria', 'Categoria é obrigatório').not().isEmpty(),
		check('tituloSimbolo', 'Titulo é obrigatório').not().isEmpty(),
		check('causasSimbolo', 'Causas é obrigatório').not().isEmpty(),
		check('solucoesSimbolo', 'Soluçoes obrigatório').not().isEmpty()
	],
	controllerSimbolos.edit
);

router.post('/cadastrar',
	[
		check('descricaoSimbolo', 'Texto descritivo é obrigatório').not().isEmpty(),
		check('idCategoria', 'Categoria é obrigatório').not().isEmpty(),
		check('tituloSimbolo', 'Titulo é obrigatório').not().isEmpty(),
		check('causasSimbolo', 'Causas é obrigatório').not().isEmpty(),
		check('solucoesSimbolo', 'Soluçoes obrigatório').not().isEmpty()
	],
	controllerSimbolos.add
);

router.post('/search',
	[
		check('search', 'Pesquisa é obrigatório').not().isEmpty(),
	],
	controllerSimbolos.search
);

router.delete('/deletar/:id', controllerSimbolos.delete);

module.exports = router;