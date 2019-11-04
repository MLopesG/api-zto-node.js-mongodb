const server = require('./config/server.js');

server.listen(process.env.PORT || 3000, () => {
	console.log('Servidor inicializado na porta.');
});
