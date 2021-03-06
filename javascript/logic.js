// Initialize Firebase
var config = {
  apiKey: "AIzaSyBjD6alEMUlP0u9ubyVRe1w_V-aT8WF9Zo",
  authDomain: "outdoorly2-1537372469520.firebaseapp.com",
  databaseURL: "https://outdoorly2-1537372469520.firebaseio.com",
  projectId: "outdoorly2-1537372469520",
  storageBucket: "outdoorly2-1537372469520.appspot.com",
  messagingSenderId: "982019906690"
};
firebase.initializeApp(config);
var database = firebase.database();

var map;
var address;
$("#submitHome").on("click", function () {
  event.preventDefault();
  inputAddress = $("#searchBar").val().trim();
  if (inputAddress === "") {
    return;
  } else {
    address = inputAddress;
    database.ref().push({
      address: address
    })
  };
  // address = address.replace(/ /g, "+");
  window.location.href = "Weather_and_Maps.html";
  localStorage.setItem("address", address);
});
address = localStorage.getItem("address");
database.ref().on("child_added", function (childSnapshot) {
  $("#searchHistory").prepend(`
    <tr>
    <td id="mapLink">
      <a href="Weather_and_Maps.html">${childSnapshot.val().address}</a>
      </td>
    </tr>
  `)
});

$(document).on("click", "#mapLink", function (event) {
  localStorage.setItem("address", $(this).text());
});

var mapUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyB8KmcbXCn9lulhHKjc593b5nskOQLDAIw";
var lat = "";
var lng = "";
function initMap() {
  $.ajax({
    url: mapUrl,
    method: "GET"
  }).then(function (response) {
    lat = response.results[0].geometry.location.lat;
    lng = response.results[0].geometry.location.lng;
    localStorage.setItem("lat", lat);
    localStorage.setItem("lng", lng);
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: lat, lng: lng },
      zoom: 13
    });
  });
}
lat = localStorage.getItem("lat");
lng = localStorage.getItem("lng");

var weathURL = "https://cors.io/?https://api.darksky.net/forecast/c9c4b9925dddceaf1c4375befa199c7b/" + lat + "," + lng;
$.ajax({
  url: weathURL,
  method: "GET"
}).then(function (response) {
  var parsedResponse = JSON.parse(response);
  console.log(parsedResponse);
  $("#tempHigh").text(parsedResponse.daily.data[0].apparentTemperatureHigh);
  $(".tempLow").text(parsedResponse.daily.data[0].apparentTemperatureLow);
  var weatherAddress = address;
  $("#weatherResponse").append(`
  <tr> 
  <td> ${weatherAddress}</td>
  <td> ${parsedResponse.daily.data[0].apparentTemperatureHigh}</td>
  <td> ${parsedResponse.daily.data[0].apparentTemperatureLow}</td>
  <td> ${parsedResponse.daily.data[0].humidity}</td>
  </tr>
  `)
});

//dynamically add the NASA picture of the day to APOD.html page
var url = "https://api.nasa.gov/planetary/apod?api_key=6NprwCeXJI4VjBtN7Sgn2stKHJZGCiUF6JIToxzr";

$.ajax({
  url: url,
  success: function (result) {
    if ("copyright" in result) {
      $("#copyright").text("Image Credits: " + result.copyright);
    }
    else {
      $("#copyright").text("Image Credits: " + "Public Domain");
    }

    if (result.media_type == "video") {
      $("#apod_img_id").css("display", "none");
      $("#apod_vid_id").attr("src", result.url);
    }
    else {
      $("#apod_vid_id").css("display", "none");
      $("#apod_img_id").attr("src", result.url);
    }
    $("#reqObject").text(url);
    $("#returnObject").text(JSON.stringify(result, null, 4));
    $("#apod_explaination").text(result.explanation);
    $("#apod_title").text(result.title);
  }


});

//function to change astronomy picture of the day to a link to APOD page
$(document).on("click", "#apod_img_id", function () {
  $("#apod_img_id").wrap("<a href='apod.html'></a>");
});

function validateForm() {
  var x = document.forms["myForm"]["fname"]['searchBar'].value;
  if (x == "") {
    alert("Name must be filled out");
    return false;
  }
}

function checkforblank () {
  if(document.getElementById('searchBar').value == "") {
    alert("please enter an address");
    document.getElementById('searchBar').style.bordercolor = "red";
    return false;
   
  }
}

