"use strict";

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '/chat.ejs';
  } else {
  }
});

function containsForbiddenCharacters(stringToCheck) {
	return stringToCheck.includes('$')
		|| stringToCheck.includes('{')
		|| stringToCheck.includes('}')
		|| stringToCheck.includes('&')
		|| stringToCheck.includes('|');
}


function dataIsForbidden(dataToCheck) {
	var foundForbidden = false;
	Object.entries(dataToCheck).forEach(([key, value]) => {
    if (containsForbiddenCharacters(`${value}`)) {
			foundForbidden = true;
		}
});
	return foundForbidden;
}


function validateForm(dataToValidate) {
	if (dataIsForbidden(dataToValidate)) {
		alert("Forbidden special characters detected.");
		return false;
	} else {
		return true;
	}

}


$(".claimItem").click(function(event){
	event.preventDefault();
	let itemId = {item: this.value};
	var request = {
		"url" : `claim-item`,
		"method" : "POST",
		"data" : itemId
	}
	console.log(itemId);
	
				$.ajax(request).done(function(response){
					location.reload();
			})
	
})


$("#accept-invite").click(function(event){
	event.preventDefault();
	console.log("HI");
	let data = $("#accept-invite");
	console.log(data);
})


$("#add_event").submit(function(event){
	event.preventDefault();
			var unindexed_array = $(this).serializeArray();
			var data = {}

			$.map(unindexed_array, function(n, i){
					data[n['name']] = n['value']
			})
		if (validateForm(data)) {
			var request = {
					"url" : `http://localhost:3000/api/events`,
					"method" : "POST",
					"data" : data
			}

			$.ajax(request).done(function(response){
				window.location.replace("/profile");
			})

    }

})


$("#signup").submit(function(event){
	event.preventDefault();
			var unindexed_array = $(this).serializeArray();
			var data = {}

			$.map(unindexed_array, function(n, i){
					data[n['name']] = n['value']
			})

		if (validateForm(data)) {
			var request = {
					"url" : `http://localhost:3000/api/signup`,
					"method" : "POST",
					"data" : data
			}
			$.ajax(request).done(function(response){
					window.location.replace("/login");
			})

    }

})

$("#add_item").submit(function(item){
	item.preventDefault();
			var unindexed_array = $(this).serializeArray();
			var data = {}

			$.map(unindexed_array, function(n, i){
					data[n['name']] = n['value']
			})

		if (validateForm(data)) {
			var request = {
					"url" : `http://localhost:3000/api/items`,
					"method" : "POST",
					"data" : data
			}

			$.ajax(request).done(function(response){
					alert("Data Inserted Successfully!");
			})

    }

})


$("#send-invite").submit(function(event){
	event.preventDefault();
			var unindexed_array = $(this).serializeArray();
			var data = {}

			$.map(unindexed_array, function(n, i){
					data[n['name']] = n['value']
			})
		if (validateForm(data)) {
			var request = {
					"url" : `http://localhost:3000/api/invites`,
					"method" : "POST",
					"data" : data
			}

			$.ajax(request).done(function(response){
					window.location.replace("/profile");
			})

    }

})


$("#update_event").submit(function(event){
    event.preventDefault();

			var unindexed_array = $(this).serializeArray();
			var data = {}

			$.map(unindexed_array, function(n, i){
					data[n['name']] = n['value']
			})

		if (validateForm(data)) {
			var request = {
					"url" : `http://localhost:3000/api/event/${data.id}`,
					"method" : "PUT",
					"data" : data
			}

			$.ajax(request).done(function(response){
					window.location.replace("/profile");
			})

    }

})

$("#update_item").submit(function(item){
    item.preventDefault();

			var unindexed_array = $(this).serializeArray();
			var data = {}

			$.map(unindexed_array, function(n, i){
					data[n['name']] = n['value']
			})

		if (validateForm(data)) {
			var request = {
					"url" : `http://localhost:3000/api/item/${data.id}`,      //
					"method" : "PUT",
					"data" : data
			}

			$.ajax(request).done(function(response){
					alert("Data Updated Successfully!");
			})

    }

})


//Deletes an event and updates the page to show it
if(window.location.pathname == "/profile"){
    $(".table tbody td a.delete").click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:3000/api/events/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                location.reload();
            })
        }

    })
}


//Deletes an item and updates the page to show it
if(window.location.pathname == "/items"){
    $(".table tbody td a.delete").click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:3000/api/item/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                location.reload();
            })
        }

    })
}