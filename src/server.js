const Server = require('boardgame.io/server').Server;
const Phaze10 = require('./shared/Phase10').Phase10;

const server = Server({ games: [Phaze10] });

server.run(8000);