const server = require('./config/server.js');

let port = process.env.PORT_APP;

server.listen(port, () => {
    console.log("Servidor inicializado na porta: " + port);
});