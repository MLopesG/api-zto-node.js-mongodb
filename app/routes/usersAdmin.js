const router = require('express').Router();
const controllerUsersAdmin = require('../controllers/usersAdminController.js');
const { check, validationResult } = require('express-validator');

router.post('/token', controllerUsersAdmin.token);

router.post('/login',
	[
		check('email', 'Email é obrigatório').not().isEmpty(),
		check('senha', 'Senha é obrigatório').not().isEmpty(),
	],
	controllerUsersAdmin.login
);

router.get('/info/:idUsuario', controllerUsersAdmin.view);
router.get('/', controllerUsersAdmin.view);

router.put('/edit/:id',
	[
		check('email', 'Email é obrigatório').not().isEmpty(),
		check('senha', 'Senha é obrigatório').not().isEmpty(),
	],
	controllerUsersAdmin.edit
);

router.post('/cadastrar',
	[
		check('email', 'Email  é obrigatório').not().isEmpty(),
		check('senha', 'Senha é obrigatório').not().isEmpty(),
	],
	controllerUsersAdmin.add
);

router.delete('/deletar/:id', controllerUsersAdmin.delete);


module.exports = router;