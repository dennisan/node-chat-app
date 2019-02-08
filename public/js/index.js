var socket = io();
socket.on('connect', function() {
	console.log(`connected to server`);
});

socket.on('disconnect', function() {
	console.log(`disconnected from server`);
});

socket.on('newMessage', function(message) {
	var formattedTime =	moment(message.createdAt).format('h:mm a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		from: message.from,
		text: message.text,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function(message) {
	var formattedTime =	moment(message.createdAt).format('h:mm a');

	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template, {
		from: message.from,
		url: message.url,
		createdAt: formattedTime
	});
	
	jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', function (e) {
	e.preventDefault();

	var messageTextbox = jQuery('[name=message]');
	socket.emit('createMessage', {
		from: 'User', 
		text: messageTextbox.val()
	}, function(message) {
		messageTextbox.val('')
	});
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {

	if (!navigator.geolocation) {
		return alert('Geolocation not supported')
	}

	// locationButton.attr('disabled', 'disabled').text('Sending location...');

	navigator.geolocation.getCurrentPosition(function (position) {
		// locationButton.removeAttr('disabled').text('Send location');
		socket.emit('newLocationMessage', {
			latitude: position.coords.latitude,
			longitude:	position.coords.longitude
		});
	}, function () {
		// locationButton.removeAttr('disabled').text('Send location');
		alert('unable to fetch location');
	});
});

