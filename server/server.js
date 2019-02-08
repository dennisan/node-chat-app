const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

var app = express();
app.use (express.static(publicPath));

var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
	console.log(`user connected`);

	socket.emit('newMessage', generateMessage('Admin','Welcome to chat app'));
	socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'));

	socket.on('createMessage', (message, callback) => {
		console.log(`createMessage`, message);
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback('Server got your message');
	});

	socket.on('disconnect', () => {
		console.log(`user disconnected`);
	})
})




server.listen(PORT, () => {
	console.log(`Started on port ${PORT}`);
});

