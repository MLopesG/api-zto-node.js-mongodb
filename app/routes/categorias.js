const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const controllerCategoria = require('../controllers/categoriasController.js');

router.get('/', controllerCategoria.view);

router.get('/info/:idCategoria', controllerCategoria.view);


router.put('/edit/:id',
	[
		check('categoria', 'Nome categoria é obrigatório').not().isEmpty(),
	],
	controllerCategoria.edit
);

router.post('/cadastrar',
	[
		check('categoria', 'Nome categoria é obrigatório').not().isEmpty(),
	],
	controllerCategoria.add
);

router.post('/search',
	[
		check('search', 'Pesquisa é obrigatório').not().isEmpty(),
	],
	controllerCategoria.search
);

router.delete('/deletar/:id', controllerCategoria.delete);

module.exports = router;