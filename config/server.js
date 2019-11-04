const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./app/public'));
app.use(bodyParser.json());
app.use(fileUpload());

// liberando cors com determinados methodos de requusição.

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

// controllers.

const users = require('../app/routes/users.js');
const categorias = require('../app/routes/categorias.js');
const simbolos = require('../app/routes/simbolos.js');
const publicidade = require('../app/routes/publicidade.js');
const useradmin = require('../app/routes/usersAdmin.js');

// Carregamanto de rotas.

app.use('/users', users);
app.use('/categorias', categorias);
app.use('/simbolos', simbolos);
app.use('/publicidade', publicidade);
app.use('/users-admin', useradmin);

module.exports = app;