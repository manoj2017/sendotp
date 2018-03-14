const http = require('http');
const hostname = 'localhost';
var port = 3000;
var express = require("express");
var app = express();


require('./middleware/config.js')(app);

require("./middleware/db.js");

require('./middleware/routes.js')(app);



const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
});