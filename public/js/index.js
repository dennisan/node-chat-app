var socket = io();

function scrollToBottom () {
	// selectors
	var messages = jQuery('#messages');
	var newMessages = messages.children('li:last-child');

	// heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessages.innerHeight();
	var lastMessageHeight = newMessages.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}

}

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
	scrollToBottom();
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
	scrollToBottom();
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

