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
		check('tituloSimbolo', 'Titulo é obrigatório').not().isEmpty()
	],
	controllerSimbolos.edit
);

router.post('/cadastrar',
	[
		check('descricaoSimbolo', 'Texto descritivo é obrigatório').not().isEmpty(),
		check('idCategoria', 'Categoria é obrigatório').not().isEmpty(),
		check('tituloSimbolo', 'Titulo é obrigatório').not().isEmpty()
	],
	controllerSimbolos.add
);

router.post('/search',
	[
		check('search', 'Pesquisa é obrigatório').not().isEmpty()
	],
	controllerSimbolos.search
);

router.delete('/deletar/:id', controllerSimbolos.delete);


// Lista tipo simbolo // causas e simbolos


router.get('/lista-simbolo/edit/:id', controllerSimbolos.editList);

router.get('/lista-simbolo',controllerSimbolos.listSimbolos);

router.post('/lista-simbolo/cadastrar',
	[
		check('idSimbolo', 'Simbolo é obrigatório').not().isEmpty(),
		check('descSimbolo', 'Descrição da lista é obrigatório').not().isEmpty(),
		check('tipoList', 'Tipo lista é obrigatório').not().isEmpty()
	],
	controllerSimbolos.addList
);

router.put('/lista-simbolo/edit/:id',
	[
		check('idSimbolo', 'Simbolo é obrigatório').not().isEmpty(),
		check('descSimbolo', 'Descrição da lista é obrigatório').not().isEmpty(),
		check('tipoList', 'Tipo lista é obrigatório').not().isEmpty()
	],
	controllerSimbolos.editList
);

router.delete('/lista-simbolo/deletar/:id', controllerSimbolos.deleteList);

module.exports = router;