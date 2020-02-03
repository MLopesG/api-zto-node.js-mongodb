const server = require('./config/server.js');
const port = 8082;

server.listen(port, () => {
    console.log("Servidor inicializado na porta: " + port);
});