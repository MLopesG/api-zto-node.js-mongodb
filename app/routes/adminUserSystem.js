const router = require('express').Router();
const controllerUsersAdmin = require('../controllers/loginUserAdmin.js');
const { check, validationResult } = require('express-validator');

router.post('/token', controllerUsersAdmin.token);

router.post('/login',
	[
		check('email', 'Email é obrigatório').not().isEmpty(),
		check('senha', 'Senha é obrigatório').not().isEmpty(),
	],
	controllerUsersAdmin.login
);

module.exports = router;