const clienws = require('ws');
const ws = new clienws("wss://tripledwebsocket.herokuapp.com/",["arduino"],{ headers: {Authorization:"espwemos"}});

ws.on('open', function open() {
    ws.send("From client in node js code");
    var strinffa = "{\"event:\"SensorUndetect\",\"message\":\"hello\"}";
    ws.send(strinffa);
});

ws.on('message', function incoming(data) {
    console.log("Receive message : "+data);
});