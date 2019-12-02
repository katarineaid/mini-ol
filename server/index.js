let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');

let app = express();
let http = require('http').Server(app);

let address = 'localhost';
let port = 7500;

const writeData = require("./router/index");

runServer();

function runServer() {
  app.use(express.static(__dirname + '/../public'));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
  app.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/../src/html/index.html'));
  });
  app.post('/view', (writeData));

  http.listen(port, function() {
    console.log('+------------------------------------------------------------+');
    console.log('| System is up and running. Copy the URL below and open this |');
    console.log('| in your browser: http://' + address + ':' + port + '/                |');
    console.log('+------------------------------------------------------------+');
  });
}