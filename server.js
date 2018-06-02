const http = require('http');
const hostname = 'localhost';
var port = 3000;
var express = require("express");
var app = express();


/* requiring config file starts*/
require('./middleware/config.js')(app);
/* requiring config file ends*/


/* requiring config db.js file starts*/
require("./middleware/db.js");
/* requiring config db.js file ends*/


/* 
requiring config db.js file starts. This files handles the all the Routes for this application.
*/
require('./middleware/routes.js')(app);



const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
});