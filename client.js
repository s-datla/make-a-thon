var net = require('net');
var client = net.connect({ port: 9001 }, function() {
    console.log('connected to server!');
    client.write("19512314625");
});

client.on('data', function(data) {
    console.log(data.toString());
    client.end();
});

client.on('end', function() {
    console.log('disconnected from server');
});