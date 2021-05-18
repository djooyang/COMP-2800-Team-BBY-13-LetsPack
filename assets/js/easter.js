"use strict";

function egg() {
	var gradient = "linear-gradient(#400000, black)";
	$("body").css("background", gradient);
	document.getElementById("pan1").src = "/img/pan1.png"
	document.getElementById("pan2").src = "/img/pan2.png"
	document.getElementById("pan3").src = "/img/pan3.png"
	document.getElementsByClassName("container_nav")[0].style.backgroundColor = "rgb(64 0 0)";
	document.getElementsByClassName("hambergerMeun")[0].style.backgroundColor = "#421919";
	document.getElementsByClassName("icon")[0].style.backgroundColor = "rgb(50 21 21)";
	document.getElementsByClassName("active")[0].innerHTML = "FryingPan";
	document.getElementById("intro").innerHTML = "We on the FryingPan team are a group of frying pan loving software developers living in beautiful British Columbia. We maintain a minimum of three pans\nin our workplace at all times. If one of us brings a pan, we can count on our team mates to also bring a pan. We're making FryingPan because we really\nwant to bring too many pans and we hope you do too!"
}

async function easter(idOfElement) {
document.getElementById(idOfElement).style.color = "red";
await new Promise(r => setTimeout(r, 2000));
document.getElementById(idOfElement).style.color = "white";
}

$(".egg").click(function(){
		easter(this.id);

		if (document.getElementById("name1").style.color === "red"
					&& document.getElementById("name2").style.color === "red"
					&& document.getElementById("name3").style.color === "red") {
			egg();
		}
})