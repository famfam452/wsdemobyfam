// const clienws = require('ws');
// const ws = new clienws("ws://localhost:5000",null,{ headers: {Authorization:"234sa"}});

// ws.on('open', function open() {
//     ws.send("From client in node js code");
// });

// ws.on('message', function incoming(data) {
//     console.log("Receive message : "+data);
// });

// const { data } = require("jquery");
// var init_admin = require("./firebase_creden/initApp");

// var jj = new init_admin();
// var database_fb = jj.admin.database();

// var ref = database_fb.ref("users/userdata");
// var datas = {};
// ref.orderByKey().on('value' ,function(snapshot) {
//     datas = snapshot.val();
//     console.log(datas);
// });
// var userid = 2;
// ref.child(userid+"/history").push({
//     timestamp:"",
//     date:"",
//     time:"",
//     threshole:""
// });
// let myst = "21:321:32";
// var myarr = myst.split(":");
// var d = parseInt(myarr[0]);
// console.log(myarr);

// var k = myarr.indexOf("asd");
// if(k != -1){
//     myarr.splice(k,1);
// }
// console.log(myarr,k);
// var hede = {'sada':'dwdaw'};
// var dwd = {'sada':'dwdaw'};
// console.log(typeof hede);
var james = Math.random();
console.log(james);
// james.push(hede);
// james.push(dwd);
// console.log(james.length);
// console.log(james.indexOf(hede))
// hede.forEach(element => {
//     console.log(element);
// });


// var strinffa = "{\"event:\"SensorUndetect\",\"message\":\"Not on Sensor\"}";
// console.log(JSON.parse(strinffa));