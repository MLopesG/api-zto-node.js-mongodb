const router = require('express').Router();
const controllerPublicidade = require('../controllers/publicoPublicidadeController.js');

router.get('/', controllerPublicidade.view);

module.exports = router;