const router = require('express').Router();
const controllerUsers = require('../controllers/usersController.js');
const { check, validationResult } = require('express-validator');

router.get('/info/:idUsuario', controllerUsers.view);

router.get('/', controllerUsers.view);

router.put('/edit/:id',
	[
		check('nomeCompleto', 'Nome completo é obrigatório').not().isEmpty(),
		check('senha', 'Senha é obrigatório').not().isEmpty(),
		check('cpf', 'CPF é obrigatório').not().isEmpty(),
	],
	controllerUsers.edit
);

router.post('/cadastrar',
	[
		check('nomeCompleto', 'Nome completo é obrigatório').not().isEmpty(),
		check('senha', 'Senha é obrigatório').not().isEmpty(),
		check('cpf', 'CPF é obrigatório').not().isEmpty(),
	],
	controllerUsers.add
);

router.delete('/deletar/:id', controllerUsers.delete);


module.exports = router;