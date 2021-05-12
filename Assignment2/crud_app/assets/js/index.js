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


function isNullEmptyOrUndefined(elementToCheck) {
	return elementToCheck !== undefined && elementToCheck !== null && elementToCheck != "";
}

function validateForm(dataToValidate) {
	if (!isNullEmptyOrUndefined(dataToValidate.name) || !isNullEmptyOrUndefined(dataToValidate.email)) {
		alert("Name and Email must not be empty.");
		return false;
	} else if (dataIsForbidden(dataToValidate)) {
		alert("Forbidden special characters detected.");
		return false;
	} else {
		return true;
	}

}


$("#add_user").submit(function(event){
	event.preventDefault();
			var unindexed_array = $(this).serializeArray();
			var data = {}

			$.map(unindexed_array, function(n, i){
					data[n['name']] = n['value']
			})

		if (validateForm(data)) {
			var request = {
					"url" : `http://localhost:3000/api/users`,
					"method" : "POST",
					"data" : data
			}

			$.ajax(request).done(function(response){
					alert("Data Inserted Successfully!");
			})

    }

})


        $("#login-submit").click(function(event) {
					console.log("Authenticating**********************");
            $.ajax({
                url: "/authenticate",
                type: "POST",
                dataType: "JSON",
                data: { email: $("#email").val(), password: $("#password").val() },
                success: function(data) {
                    //console.log("Data returned from server: ", data);
                    if(data['status'] == "success") {
                        // redirect
                        window.location.replace("/profile");
                    } else {
                        // show error message
											console.log("ERROR THROWNING");
                        $("#errorMsg").html(data['msg']);
                    }

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("body").text(jqXHR.statusText);
                }
            });

        });


$("#update_user").submit(function(event){
    event.preventDefault();

			var unindexed_array = $(this).serializeArray();
			var data = {}

			$.map(unindexed_array, function(n, i){
					data[n['name']] = n['value']
			})

		if (validateForm(data)) {
			var request = {
					"url" : `http://localhost:3000/api/users/${data.id}`,
					"method" : "PUT",
					"data" : data
			}

			$.ajax(request).done(function(response){
					alert("Data Updated Successfully!");
			})

    }

})


if(window.location.pathname == "/"){
    $(".table tbody td a.delete").click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:3000/api/users/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            })
        }

    })
}