const bodyParser = require('body-parser');
var Session = require('express-session');
var Session = Session({
    secret: 'secrettokenhere',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 50000 }
});
// requiring Helper file to run helper functions
const helper = require('./helper');


var method = routes.prototype;

function routes(app, io) {

    app.use(bodyParser.json());
    app.use(Session);

    var sessionInfo;

    app.get('/', function(req, res) {
        res.render('index');
    });

    app.post('/login', function(req, res) {
        sessionInfo = req.session;
        const data = {
            "email": req.body.email,
            "password": req.body.password
        }

        helper.isUserExists(data, function(result) {

            if (result.isUserExists === true) {
                sessionInfo.sessionData = {
                    userID: result.id
                };
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify(result));
        });

    });

    app.post('/register', function(req, res) {
        sessionInfo = req.session;

        const data = {

            mobile: req.body.mobile,
            isVerified: false
        }

        helper.createUser(data, function(result) {

            if (typeof result.isUserAdded != "undefined" && result.isUserAdded == true) {
                sessionInfo.sessionData = {
                    userID: result.id
                };
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify(result));
        });
    });

    app.post('/getUserInfo', function(req, res) {
        sessionInfo = req.session;
        if (typeof sessionInfo.sessionData == "undefined" || sessionInfo.sessionData == null) {

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify({ process: "failed" }));
        } else {
            if (sessionInfo.sessionData.userID == "" || sessionInfo.sessionData.userID != req.body.id) {

                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(JSON.stringify({ process: "failed" }));
            } else {
                const data = {
                    _id: req.body.id
                };

                helper.getUserInfo(data, function(result) {

                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(JSON.stringify(result));
                });
            }

        }
    });

    app.post('/sendOtp', function(req, res) {
        sessionInfo = req.session;
        const userID = req.body.id;
        const data = {
            _id: userID
        }

        helper.sendOtp(data, function(result) {
            console.log(result);
            var response = {};
            if (result.process) {
                sessionInfo.otpData = {
                    id: userID,
                    otp: result.otp
                };
                response.otpCreated = true;
            } else {
                response.otpCreated = false;
                response.message = result.message;
            }
            response.message = result.message;

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify(response));
        });
    });

    app.post('/verifyOtp', function(req, res) {
        sessionInfo = req.session;

        const data = {
            otp: req.body.otp,
            id: req.body.id
        }
        const otpData = sessionInfo.otpData;

        helper.verifyOtp(data, otpData, function(result) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify(result));
        });
    });


    app.post('/logout', function(req, res) {
        sessionInfo = req.session;
        sessionInfo.sessionData = null;
        res.end();
    });

    app.get('/getBalance', function(req, res) {
        helper.getBalance(function(result) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify('Done'));
        });
    });
}

method.getroutes = function() {
    return this;
}

module.exports = routes;