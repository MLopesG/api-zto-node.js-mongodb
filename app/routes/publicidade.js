const router = require('express').Router();
const controllerPublicidade = require('../controllers/publicidadeController.js');
const { check, validationResult } = require('express-validator');

router.get('/', controllerPublicidade.view);

router.get('/info/:idPublicidade', controllerPublicidade.view);

router.put('/edit/:id',
	[
		check('linkPost', 'Link da postagem redirecionamento é obrigatório').not().isEmpty(),
		check('timePost', 'Time da postagem é obrigatório').not().isEmpty()
	],
	controllerPublicidade.edit
);

router.post('/cadastrar',
	[
		check('linkPost', 'Link da postagem redirecionamento é obrigatório').not().isEmpty(),
		check('timePost', 'Time da postagem é obrigatório').not().isEmpty()
	],
	controllerPublicidade.add
);

router.delete('/deletar/:id', controllerPublicidade.delete);

module.exports = router;