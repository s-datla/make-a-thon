const Net = require('net')
const app = require('express')();
var httpServer = require('http').createServer(app);
var io = require('socket.io')(httpServer);
var dir = __dirname;
const port = 9001;

users = [
    { uid: "19512314625", name: "Ash", webex: "https://amex.webex.com/join/ash.gale" },
    { uid: "1953318525", name: "Avinash", webex: "https://amex.webex.com/join/avinash.banerjee" },
    { uid: "195563225", name: "Matt", webex: "https://amex.webex.com/join/matthew.byrne" }
]

authorised = [
    "Avinash",
    "Ash"
]

const server = new Net.Server();

httpServer.listen(4000, function() {
    console.log("HTTP-Server listening for request on socket localhost:4000");
});

app.get('/', function(req, res) {
    res.sendFile(dir + '/index.html');
});

server.listen(port, function() {
    console.log(`Server listening for connection requests on socket localhost:${port}.`);
});

const authorise = (uid) => {
    let isAuthorised = users.find(user => user.uid === uid && authorised.includes(user.name)) != undefined;
    return isAuthorised ? "1" : "0";
};

// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
server.on('connection', function(socket) {
    console.log('A new connection has been established.');

    // The server can also receive data from the client by reading from its socket.
    socket.on('data', function(chunk) {
        console.log('Data received from client: ' + chunk.toString());
        // Now that a TCP connection has been established, the server can send data to
        // the client by writing to its socket.
        let isAuthorised = authorise(chunk.toString());
        socket.write(isAuthorised);
        io.emit('auth_request', {
            user: users.find(u => u.uid === chunk.toString()),
            authorised: isAuthorised
        })

    });

    // When the client requests to end the TCP connection with the server, the server
    // ends the connection.
    socket.on('end', function() {
        console.log('Closing connection with the client');
    });

    // Don't forget to catch error, for your own sake.
    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});