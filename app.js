const server = require('./config/server.js');

server.listen(3000, () => {
	console.log('Servidor inicializado na porta:3000');
});
