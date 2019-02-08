const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

var app = express();
app.use (express.static(publicPath));

var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
	console.log(`user connected`);

	socket.emit('newMessage', {
		from: 'mike@example.com',
		text: 'Seee ya',
		createdAt: 123
	});

	socket.on('createMessage', (message) => {
		console.log(`Message created`, message);
	})

	socket.on('disconnect', () => {
		console.log(`user disconnected`);
	})
})




server.listen(PORT, () => {
	console.log(`Started on port ${PORT}`);
});

