const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./app/public'));
app.use(bodyParser.json());
app.use(fileUpload());

// liberando cors com determinados methodos de requusição.

const authApi = require('../auth.js');

app.use(cors());

// controllers.

const users = require('../app/routes/users.js');
const categorias = require('../app/routes/categorias.js');
const simbolos = require('../app/routes/simbolos.js');
const publicidade = require('../app/routes/publicidade.js');
const useradmin = require('../app/routes/usersAdmin.js');
const config = require('../app/routes/config.js');
const usersSystem = require('../app/routes/userSystem.js');
const usersAdminSystem = require('../app/routes/adminUserSystem.js');

// Carregamanto de rotas.

app.use('/auth-user',usersSystem);
app.use('/auth-user-admin',usersAdminSystem);
app.use('/users',authApi,users);
app.use('/categorias',authApi,categorias);
app.use('/simbolos',authApi,simbolos);
app.use('/publicidade',authApi,publicidade);
app.use('/users-admin',authApi,useradmin);
app.use('/config',authApi,config);

module.exports = app;