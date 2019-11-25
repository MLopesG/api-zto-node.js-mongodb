const jwt = require('jsonwebtoken');
const config = require('./secret.js');

module.exports = (req, res, next) => {
 let token = req.headers['authorization'];
  if (token) {
    if (token.startsWith('Bearer')) {
      token = token.slice(7, token.length);
    }
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
         res.status(417).json({
          success: false,
          message: 'Não possui authorization para acessar api, token inválido.'
        });
      } else {
        next();
      }
    });
  } else {
    res.status(417).json({
      success: false,
      message: 'Não possui authorization para acessar api.'
    });
  }
};