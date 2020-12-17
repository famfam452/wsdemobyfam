
const exprss = require('express');
const app = exprss();
var http = require('http');
var path = require("path");

var bodyParser = require("body-parser");


const init_admin = require("./firebase_creden/initApp");
const admin_creden = new init_admin();
var database_fb = admin_creden.admin.database();


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use('/css', exprss.static(path.join(__dirname,'node_modules/bootstrap/dist/css')));
app.use('/js', exprss.static(path.join(__dirname,'node_modules/bootstrap/dist/js')));
app.use('/js', exprss.static(path.join(__dirname,'node_modules/jquery/dist')));
app.use('/plotlyjs', exprss.static(path.join(__dirname,'node_modules/plotly.js-dist/')));
const server = http.createServer(app);

// require('dns').lookup(require('os').hostname(), function (err,add,fam) {
//     console.log('addr: '+add);
// })


const WebSocket = require('ws');
const { send } = require('process');
const { expr } = require('jquery');
const expressWs = require('express-ws');
const s = new WebSocket.Server({ noServer:true });
var clients_WS = {};
var client_brw = [];

function authenticate(request,checkclient) {
    var client = "client:";
    if (request.headers['sec-websocket-key'] && request.headers.authorization) {
        var ws_key = request.headers['sec-websocket-key'];
        var authorize = request.headers.authorization;
        if (request.headers['sec-websocket-protocol'] == "arduino") {
            client += request.headers['sec-websocket-protocol']+":"+authorize;
        } else {
            client += "software:"+authorize;
        }
        //console.log(request.connection.remoteAddress);
        checkclient(null,client);   
    } else if (request.headers['sec-websocket-key']){
        var ws_key = request.headers['sec-websocket-key'];
        
        if (request.headers['sec-websocket-protocol'] == "brownser"){
            client += request.headers['sec-websocket-protocol']+":"+ws_key;
        }
        checkclient(null,client); 
    } else {
        const err = new Error("No sec-websocket-key");
        checkclient(err,client);
    }
    
}

app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/userlist', function(req,res) {
    var ref = database_fb.ref("users/userdata");
    ref.orderByKey().once('value' ,function(snapshot) {
        res.contentType('application/json');
        res.send(JSON.stringify(snapshot.val()));
    });
    return res;
});

s.on('connection', function(ws,req, client) {
    console.log("client connected");
    ws.send('Hello from server');
    clients_WS[client] = ws;
    if (req.headers['sec-websocket-protocol'] == "arduino") {
        var pairs = "client:software:"+req.headers.authorization; 
        var clientProtocol = "arduino";
    }else if (req.headers['sec-websocket-protocol'] == "brownser") {
        var pair = "";
        var clientProtocol = "brownser";
        //client_brw[client]=ws;
        client_brw.push(ws);
        
    }else {
        var pairs = "client:arduino:"+req.headers.authorization;
        var clientProtocol = "software"; 
    }
    ws.on('message',function(message) {
        if(message[0] == '{'){
            //Json Object Message
        if(clientProtocol == "arduino" || clientProtocol == "software"){
            if(clients_WS[pairs]){
                var sendto = clients_WS[pairs];
                var jsonDATA = {event:"PairData",sender:client,message:message};
                sendto.send(JSON.stringify(jsonDATA));
                //console.log(client+" sent to "+pairs);
            }
        }else if(clientProtocol == "brownser"){
            console.log(message);
        }
        if (clientProtocol == "arduino"){
            var nameofsender = client;
            if (client = "client:arduino:espwemos"){
                nameofsender = "famfam452";
            }
            if (client_brw.length != 0){
                client_brw.forEach(e => {
                    var messageJSONOb = JSON.parse(message);
                    if(messageJSONOb.event){
                        if(messageJSONOb.event == "SensorData"){
                            var valueforweb = {client:nameofsender,event:messageJSONOb.event,value:messageJSONOb.message};
                            e.send(JSON.stringify(valueforweb));
                        }else if(messageJSONOb.event == "SensorUndetect"){
                            var valueforweb = {client:nameofsender,event:messageJSONOb.event,value:messageJSONOb.message};
                            e.send(JSON.stringify(valueforweb));
                        }else if(messageJSONOb.event == "SensorError"){
                            var valueforweb = {client:nameofsender,event:messageJSONOb.event,value:messageJSONOb.message};
                            e.send(JSON.stringify(valueforweb));
                            console.log("SensorError");
                        }
                    }
                });
            }
        }
        }else{
            //String Message
        console.log("from client : "+message+" From "+client);
        if(clientProtocol == "arduino" || clientProtocol == "software"){
            if(clients_WS[pairs]){
                var sendto = clients_WS[pairs];
                var jsonDATA = {event:"Pair",sender:client,message:message};
                sendto.send(JSON.stringify(jsonDATA));
                //console.log(client+" sent to "+pairs);
            }
        }else if(clientProtocol == "brownser"){
            console.log(message);
        }
        }
    });
    ws.on('close',function(){
        console.log("client disconnected");
        delete clients_WS[client];
        if(clientProtocol == "brownser"){
            var k = client_brw.indexOf(ws);
            if(k != -1){
                client_brw.splice(k,1);
            }
        }
    });
});

server.on('upgrade', function upgrade(request,socket,head) {
    authenticate(request, (err,client) => {
        if (err || !client) {
            socket.write('HTTP/1.1 404 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }
        s.handleUpgrade(request,socket,head, function done(ws) {
            s.emit('connection', ws, request, client);
        });
    });
});


server.listen(5000);
