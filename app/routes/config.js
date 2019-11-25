const router = require('express').Router();
const controllerConfig = require('../controllers/configController.js');

router.post('/database-drop', controllerConfig.deleteDatabase);

module.exports = router;