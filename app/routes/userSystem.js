const router = require('express').Router();
const controllerUsers = require('../controllers/loginUser.js');
const { check, validationResult } = require('express-validator');

router.post('/token', controllerUsers.token);

router.post('/login',
	[
		check('cpf', 'CPF é obrigatório').not().isEmpty(),
		check('senha', 'Senha é obrigatório').not().isEmpty(),
	],
	controllerUsers.login
);

module.exports = router;