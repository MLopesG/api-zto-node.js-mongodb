const router = require('express').Router();
const controllerUsers = require('../controllers/usersController.js');
const { check, validationResult } = require('express-validator');

router.post('/token', controllerUsers.token);

router.post('/login',
	[
		check('cpf', 'CPF é obrigatório').not().isEmpty(),
		check('cpf').isLength({ min: 11, max: 11 }),
		check('senha', 'Senha é obrigatório').not().isEmpty(),
	],
	controllerUsers.login
);

router.get('/info/:idUsuario', controllerUsers.view);

router.get('/', controllerUsers.view);

router.put('/edit/:id',
	[
		check('nomeCompleto', 'Nome completo é obrigatório').not().isEmpty(),
		check('senha', 'Senha é obrigatório').not().isEmpty(),
		check('senha').isLength({ min: 8 }),
		check('cpf', 'CPF é obrigatório').not().isEmpty(),
		check('cpf').isLength({ min: 11, max: 11 }),
		check('empresa', 'Empresa é obrigatório').not().isEmpty(),
		check('tipoVeiculo', 'Tipo veiculo é obrigatório').not().isEmpty(),
		check('marcaVeiculo', 'Marca veiculo é obrigatório').not().isEmpty(),
	],
	controllerUsers.edit
);

router.post('/cadastrar',
	[
		check('nomeCompleto', 'Nome completo é obrigatório').not().isEmpty(),
		check('senha', 'Senha é obrigatório').not().isEmpty(),
		check('senha', 'Senha é obrigatório').isLength({ min: 8 }),
		check('cpf', 'CPF é obrigatório').not().isEmpty(),
		check('cpf').isLength({ min: 11, max: 11 }),
		check('empresa', 'Empresa é obrigatório').not().isEmpty(),
		check('tipoVeiculo', 'Tipo veiculo é obrigatório').not().isEmpty(),
		check('marcaVeiculo', 'Marca veiculo é obrigatório').not().isEmpty(),
	],
	controllerUsers.add
);

router.delete('/deletar/:id', controllerUsers.delete);


module.exports = router;