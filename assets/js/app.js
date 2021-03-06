//Foursquare SEARCH endpoint
var client_id = 'HU31LS5FUBEXJMWI5FTBJFRGKDPGDGGJBSMV2A14CEP5YOO0';
//var client_id = 'HU31LS5FUBEXJMWI5FTBJFRGKDPGDGGJBSMV2A14CEP5YOO0';

var client_secret = 'OYOQDBMT2Q50B3HQNQXO0KXNMV2GR25DF05HUCWFFX3JEO2Y';
//var client_secret = 'OYOQDBMT2Q50B3HQNQXO0KXNMV2GR25DF05HUCWFFX3JEO2Y';

var near = ''
var userRadiusMi = ''
var userRadiusM = userRadiusMi / 0.00062137
var version = 20180918
var query = ''
var venueIDs = []
$("#searchAgainB").hide()

var getSearch = function (queryURL) {
    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function (response) {
            if (response.response.venues.length) {
                // for (var i = 0; i < response.response.venues.length; i++) {
                //     venueIDs.push(response.response.venues[i].id)
                // }
                _.each(response.response.venues, function(item){
                    venueIDs.push(item.id)
                })
                idSearch()
            } else {
                console.log("No Results!")
            }
        });
}

var idSearch = function () {
    for (var j = 0; j < venueIDs.length; j++) {
        var queryURL = "https://api.foursquare.com/v2/venues/" + venueIDs[j] + "?client_id=" + client_id + "&client_secret=" + client_secret + "&v=" + version
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function (response) {
                //create results div

                console.log(queryURL)

                console.log(response.response.venue)

                var $resultDiv = $("<div>").addClass('result zomato-site')

                var $nameP = $("<div>").text(response.response.venue.name).addClass("div-header")
                var $addressP = $("<p>").text(response.response.venue.location.address).addClass("address")
                var $categoryP = $("<p>").text(response.response.venue.categories.name).addClass("category")

                //change the rating to be out of 5
                var rNum = response.response.venue.rating / 2
                var rating = (Math.round(rNum * 10) / 10).toFixed(1)
                var $ratingP = $("<p>").text(rating).addClass("rating")

                //adding dollar signs for price tiers
                var priceArray = []
                for (var k = 0; k < response.response.venue.price.tier; k++) {
                    priceArray.push("$")
                }
                var $pricesP = $("<p>").text(priceArray.join(" ")).addClass("prices")

                //format hours from boolean to yes/no strings
                var openString = ''
                if (response.response.venue.hours.isOpen === true) {
                    openString = "Open now!"
                } else if (response.response.venue.hours.isOpen === false) {
                    openString = "Closed right now"
                } else {
                    openString = "We don't have data on this"
                }
                var $hoursP = $("<p>").text(openString).addClass("open")

                var $linkA = $("<a>").text("View Website").attr("href", response.response.venue.page.pageInfo.links.items[0].url).addClass("link")

                var $resTxt = $("<div>").addClass("div-text")
                var $headTxt = $("<div>").addClass("div-header")

                $resultDiv.append($headTxt)

                $headTxt.append($nameP)
                $headTxt.append($addressP)

                $resultDiv.append($resTxt)

                $resTxt.append($categoryP)
                $resTxt.append(makeStars(rating))
                $resTxt.append($ratingP)
                $resTxt.append($pricesP)
                $resTxt.append($hoursP)
                $resTxt.append($linkA)

                $(".results").append($resultDiv)
            })
    }
}

function getCurrentLocation() {
    //Get current location (default if leaving location blank)
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("Geolocation is not supported by this browser. Please enter a Location")
        }
    }
    getLocation()

    function showPosition(position) {
        var curLat = position.coords.latitude
        var curLon = position.coords.longitude
        var latLon = Math.round(curLat * 10) / 10 + ',' + Math.round(curLon * 10) / 10
        userRadiusMi = $("#radiusSearch").val()
        userRadiusM = userRadiusMi / 0.00062137
        query = $("#query").val()

        if (!$("#locationSearch").val()) {
            var queryURL = "https://api.foursquare.com/v2/venues/search?client_id=" + client_id + "&openNow=1" + "&client_secret=" + client_secret + "&ll=" + latLon + "&v=" + version + "&intent=browse" + "&radius=" + userRadiusM + "&limit=10" + "&query=" + query
            getSearch(queryURL)
        } else if ($("#locationSearch").val()) {
            var queryURL = "https://api.foursquare.com/v2/venues/search?client_id=" + client_id + "&openNow=1" + "&client_secret=" + client_secret + "&near=" + near + "&v=" + version + "&intent=browse" + "&radius=" + userRadiusM + "&limit=10" + "&query=" + query
            getSearch(queryURL)
        } else {
            console.log("Broken")
        }
    }
}

$("#submitSearch").on("click", function () {
    venueIDs = []
    $("#searchAgainB").show()
    $(".main").hide()
    if (!$("#locationSearch").val()) {
        getCurrentLocation()
    } else if ($("#locationSearch").val()) {
        near = $("#locationSearch").val()
        userRadiusMi = $("#radiusSearch").val()
        userRadiusM = userRadiusMi / 0.00062137
        query = $("#query").val()

        var queryURL = "https://api.foursquare.com/v2/venues/search?client_id=" + client_id + "&openNow=1" + "&client_secret=" + client_secret + "&near=" + near + "&v=" + version + "&intent=browse" + "&radius=" + userRadiusM + "&limit=10" + "&query=" + query
        getSearch(queryURL)
    } else {
        console.log("Broken")
    }
})



var radius = 10000; // the search radius, in meters
var zoomLevel = 15; // The default zoom level for OpenMapQuest static map search
// a 400px image covers ~25 miles

function getMap(locations) { // Request a static map for the area from OpenMapQuest

    if (typeof locations != "object") {
        alert("getMap() invalid parameter\n" + typeof locations);
        return false;
    }

    var OpenMQKey = "4DAFdAxvqtX0oTrlvDv5Z1sKAvOVd2Rt";

    // Build the search URL

    // Start with the URL and API key
    var URL = "https://open.mapquestapi.com/staticmap/v5/map?key=" + OpenMQKey;

    // Add the center of the map
    if (locations[0][0]) { // This as a two dimentional array.  The first element is the center of the map}
        // The first element of locations[] is the center of the map
        URL = URL + "&center=" + locations[0][0] + "," + locations[0][1];

        // Add points of interest
        var lLength = locations.length;

        if (lLength > 1) {
            // the rest of the elements in the array are latitude and longitude for markers

            // select the marker style and begin the locations parameter
            URL = URL + "&defaultMarker=marker-num&locations="

            for (var i = 1; i < lLength; i++) {
                URL = URL + locations[i][0] + "," + locations[i][1];

                // double pipe "||" to separate the coordinates of multiple markers
                if ((i + 1) < lLength)
                    URL = URL + "||";
            }
        }
    } else { // Only one element in the array...its the center of the map.  There are no points of
        // interest
        URL = URL + "&center=" + locations[0] + "," + locations[1];
    }

    // complete the seach query with images type (satellite), zoom level and image size
    URL = URL + "&type=sat&zoom=" + zoomLevel + "&size=400,300";

    $.get(URL)
        .then(function () {
            $("#map").attr("src", this.url);
        })
        .catch(function () { // the search request falied
            alert(URL);
            return false;
        });

    return true;
}

function formatAddress(address) { // The address received from Zomato is a comma-delimited string.  Reformat that string to a friendlier,
    // more familiar format

    var addr = address.split(",");

    var rString = "";
    var aLength = addr.length;
    var aCount = 0;
    _.each(addr,  function(item){
        rString = rString + item;

        if (aCount < (aLength - 1)) {
            rString = rString + "<br>";
            aCount++;
        }
    })
    

    return rString;
}

function makeStars(numStars) { // Create a row of five stars to graphically represent the avaerage rating assigned by customers
    //
    // I'm using Font Awesome icons for outlined and solid stars.  The class used to identify a hollow
    // star is "far fa-star" and a solid star is "fas fa-star".  A half-star is "fas fa-star-half-alt".

    // First create a <div> element to hold the sars 

    var starBar = $("<div>");
    starBar.addClass("star-div");

    // Next, create five <i> elements to represent the star rating.  Font Awesome recommends using the
    // <i> tag to include their icons in HTML.

    for (var i = 1; i < 6; i++) {
        var iTag = $("<i>");

        if (i <= numStars) {
            iTag.addClass("fas fa-star");
        } else
        if ((i - numStars) < 1) { // If numStars is not a round number (it will happen far more often than not), there will be
            // one iteration of the loop where i is neither less than numStars nor greater than numStars.
            // Add a half star to the row...

            iTag.addClass("fas fa-star-half-alt");
        } else {
            iTag.addClass("far fa-star");
        }

        starBar.append(iTag);
    }

    return starBar;
}

// function displayZomato (data, name)
function displayZomato(data, name, number) { // get data from Zomato for the establishment at the specified latitude and longitude
    console.log("********************");
    console.log("displayZomato()");

    var zomatoDiv = $(".zomato-site[value='" + number + "']");
    console.log(zomatoDiv);
    var headDiv = $("<div>");
    var textDiv = $("<div>");

    var p1 = $("<p>");
    var p2 = $("<p>");
    var p3 = $("<p>");
    var p4 = $("<p>");
    var p5 = $("<p>");
    var p6 = $("<p>");

    headDiv = $("<div>");

    headDiv
        .addClass("div-header")
        .text(data.restaurant.name);

    p1.html(formatAddress(data.restaurant.location.address));
    p3.text(data.restaurant.cuisines);
    p4.text("average cost for 2: " + data.restaurant.currency + data.restaurant.average_cost_for_two);
    p5.text("rated: " + data.restaurant.user_rating.aggregate_rating);
    p6.text(data.restaurant.user_rating.votes + " votes");

    textDiv
        .addClass("div-text")
        .append(p1)
        .append(p3)
        .append(p4)
        .append(makeStars(data.restaurant.user_rating.aggregate_rating))
        .append(p5)
        .append(p6);

    zomatoDiv
        .append(headDiv)
        .append(textDiv);
}

function makeZomato(number) { // The Zomato API call is asynchronous and the order those API calls complete and are returned
    // cannot be determined by synchronous code...I can't submit the search and add a marker to the
    // map in a simple loop.  displayZomato() can't make the <div> elements to display the data for
    // each restaurant.  But I can make a <div> element ahead of time and put nothing in it except an
    // attribute value to identify it.  displayZomato () uses these elements.

    var zomatoDiv = $("<div>");
    zomatoDiv
        .addClass("zomato-site")
        .attr("value", number);

    $(".results").append(zomatoDiv);
}

function getZomato(name, latitude, longitude, number) { // get data from Zomato for the establishment at the specified latitude and longitude
    console.log("********************");
    console.log("getZomato()");

    //     var queryURL = "https://developers.zomato.com/api/v2.1/search?q=Luna Cleveland&radius=1&count=1"
    var queryURL = "https://developers.zomato.com/api/v2.1/search?count=1&q=" + name +
        "&lat=" + latitude +
        "&lon=" + longitude +
        "&radius=1000";

    $.ajax({
            url: queryURL,
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('user-key', '71908c4a0942db243aa61de4a0bff5f2');
            },
        })
        .then(function (response) {
            // response.restaurants.forEach(function (data) {
            //     displayZomato(data, name, number)
            // });

            _.each(response.restaurants, function (data) {
                displayZomato(data, name, number);
            })
        })
        .catch(function (e) {
            console.log(e);
        });
}

// get data from Zomato for the establishment at the specified latitude and longitude
function searchZomato(latitude, longitude) {

    var cuisineId = $("#cuisines").find(':selected').attr("data");
    console.log(cuisineId);

    console.log("Search Zomato ", radius);
    var queryURL = "https://developers.zomato.com/api/v2.1/search?count=5&&lat=" + latitude +
        "&lon=" + longitude +
        "&radius=" + radius +
        "&cuisines=" + cuisineId;

    $.ajax({
            url: queryURL,
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('user-key', '71908c4a0942db243aa61de4a0bff5f2');
            },
        })
        .then(function (response) {
            var map = [];

            // the first element is the center of the map
            // While testing, use the coordinates of the first item in FourSquare response as the center of the
            // map
            map.push([response.restaurants[0].restaurant.location.latitude, response.restaurants[0].restaurant.location.longitude]);

            var count = 1;
            response.restaurants.forEach(function (data) {
                makeZomato(count);

                displayZomato(data, name, count++)

                map.push([data.restaurant.location.latitude, data.restaurant.location.longitude]);
            });

            getMap(map);
        })
        .catch(function (e) {
            console.log(e);
        });
}

function getFourSquare(lat, lng) {


    console.log("********************");
    console.log("getFourSquare()");
    console.log(lat);
    var client_id = 'HU31LS5FUBEXJMWI5FTBJFRGKDPGDGGJBSMV2A14CEP5YOO0';
    var client_secret = 'OYOQDBMT2Q50B3HQNQXO0KXNMV2GR25DF05HUCWFFX3JEO2Y';

    var latLon = "";
    // Northfield
    //     lat = 41.3451;
    //     lng = -81.5285;
    // Case Western Reserve University
    //     lat = 41.5043;
    //     lng = -81.6084;
    //     latLon = lat.toString() + "," + lng.toString();
    // 
    //     if (!lat || !lng)
    //     {   
    //         // Can use Latitude Longitude or Near One is requireed
    //         // var latLon = "41.08,-81.51"
    //         // var near = "Akron"
    // 
    //         alert ("Error");
    //         return;
    //     }
    var version = 20180918
    var queryURL = "";

    if (lat) {
        if (lng) {
            // Can use Latitude Longitude or Near One is requireed
            // var latLon = "41.08,-81.51"
            // var near = "Akron"

            queryURL = "https://api.foursquare.com/v2/venues/explore?client_id=" + client_id +
                "&client_secret=" + client_secret +
                "&ll=" + lat.toString() + "," + lng.toString() +
                "&v=" + version +
                "&section=food&radius=" + radius +
                "&limit=5";
        } else {
            queryURL = "https://api.foursquare.com/v2/venues/explore?client_id=" + client_id +
                "&client_secret=" + client_secret +
                "&near=" + lat +
                "&v=" + version +
                "&section=food&radius=" + radius +
                "&limit=5";
        }
    } else {
        alert("Error");
        return;
    }

    var intent = "browse"
    // var radius = 1000
    //     var version = 20180918

    //     var queryURL = "https://api.foursquare.com/v2/venues/explore?client_id="+ client_id +
    //                    "&client_secret=" + client_secret +
    //                    "&ll=" + latLon +
    //                    "&v=" + version +
    //                    "&section=food&radius="+radius +
    //                    "&limit=5";

    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function (response) {

            // create an array for getMap()
            var map = [];

            // the first element is the center of the map
            // While testing, use the coordinates of the first item in FourSquare response as the center of the
            // map
            map.push([response.response.groups[0].items[0].venue.location.lat, response.response.groups[0].items[0].venue.location.lng]);

            var count = 1;
            response.response.groups[0].items.forEach(function (data) {
                console.log("location: ", data.venue.location.lat, " ", data.venue.location.lng)
                // Send these coordinates to the Zomato function

                makeZomato(count);

                getZomato(data.venue.name, data.venue.location.lat, data.venue.location.lng, count++);

                // and pust them into the array for getMaps()
                map.push([data.venue.location.lat, data.venue.location.lng]);

            })

            getMap(map);
        });
}

$(document).ready(function () {
    //
    //

    //     getFourSquare("Cleveland");
    getMap([41.4993, -81.6944]);

    // $(".radio-input").on("change", function()
    // {   // event handler for the range radio button

    //     var range =  $("#radiusExplore").val()

    //     console.log("RADIUS " + range);
    //     radius = 1609 * range;              // there are 1609 meters in a mile

    //     zoomLevel = 10;                     // 400px images covers ~ 25 miles 
    //     if (range == 10) zoomLevel = 11;    // 400px images covers ~ 12 miles
    //     if (range == 5) zoomLevel = 12      // 400px images covers ~ 6 miles
    // });

    $("#submitExplore").on("click", function (event) {
        event.preventDefault();
        $("#searchAgainB").show()
        $(".main").hide()

        var range = $("#radiusExplore").val()

        console.log("RANGE " + range);
        radius = 1609 * range; // there are 1609 meters in a mile

        console.log("RADIUS " + radius);

        zoomLevel = 10; // 400px images covers ~ 25 miles 
        if (range == 10) zoomLevel = 11; // 400px images covers ~ 12 miles
        if (range == 5) zoomLevel = 12 // 400px images covers ~ 6 miles

        // Get data from the form and...
        // - retrieve a map from MapQuest
        // - get data from 

        // Clear any previous results
        $(".foodie-section").empty();

        // getMap() takes 1 parameter -- an array.  This array can have an arbitrary number of elements,
        // but must have at least one.
        //
        // The first element in the array represents the center of the map.  It can be either latituse
        // and longitude or strings with city name and state.
        //
        // The remaining elements represent multiple points of interest.  These must be latitde and
        // longitude.

        if ($("#foursquare:checked").length) {
            if ($("#input-city").val() != "")
                getFourSquare($("#input-city").val().trim())
            else
                getFourSquare(41.5043, -81.6084)
        } else

        {
            searchZomato(41.5043, -81.6084);
        }
    });
})

$(".searchAgain").on("click", function () {
    $(".main").show()
    $(".results").find('*').not(".searchAgain").not("#searchAgainB").remove();
    $("#searchAgainB").hide()
})