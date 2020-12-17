const clienws = require('ws');
const ws = new clienws("ws://localhost:5000",null,{ headers: {Authorization:"espwemos"}});

ws.on('open', function open() {
    ws.send("From client in node js code");
});

ws.on('message', function incoming(data) {
    console.log("Receive message : "+data);
});