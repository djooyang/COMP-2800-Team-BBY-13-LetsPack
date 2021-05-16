"use strict";

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
					"url" : `https://letspack.herokuapp.com/api/events`,
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
					"url" : `https://letspack.herokuapp.com/api/signup`,
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
					"url" : `https://letspack.herokuapp.com/api/items`,
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
					"url" : `https://letspack.herokuapp.com/api/invites`,
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
					"url" : `https://letspack.herokuapp.com/api/event/${data.id}`,
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
					"url" : `https://letspack.herokuapp.com/api/item/${data.id}`,      //
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
            "url" : `https://letspack.herokuapp.com/api/events/${id}`,
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
            "url" : `https://letspack.herokuapp.com/api/item/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                location.reload();
            })
        }

    })
}