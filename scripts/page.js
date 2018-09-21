var radius = 10000;                     // the search radius, in meters
var zoomLevel = 15;                     // The default zoom level for OpenMapQuest static map search
                                        // a 400px image covers ~25 miles

function getMap(locations)
{   // Request a static map for the area from OpenMapQuest

    if (typeof locations != "object")
    {   alert ("getMap() invalid parameter\n" + typeof locations);
        return false;
    }

    var OpenMQKey = "4DAFdAxvqtX0oTrlvDv5Z1sKAvOVd2Rt";
    
    // Build the search URL

    // Start with the URL and API key
    var URL = "https://open.mapquestapi.com/staticmap/v5/map?key=" + OpenMQKey;

    // Add the center of the map
    if (locations[0][0])
    {   // This as a two dimentional array.  The first element is the center of the map}
        // The first element of locations[] is the center of the map
        URL = URL + "&center=" + locations[0][0] + "," + locations[0][1];
            
        // Add points of interest
        var lLength = locations.length;

        if (lLength > 1)
        {
            // the rest of the elements in the array are latitude and longitude for markers

            // select the marker style and begin the locations parameter
            URL = URL + "&defaultMarker=marker-num&locations="

            for (var i=1; i<lLength; i++)
            {   URL = URL + locations[i][0] + "," + locations[i][1];

                // double pipe "||" to separate the coordinates of multiple markers
                if ((i + 1) < lLength)
                    URL = URL + "||";
            }
        }
    }
    else
    {   // Only one element in the array...its the center of the map.  There are no points of
        // interest
        URL = URL + "&center=" + locations[0] + "," + locations[1];
    alert (URL);
    }

    // complete the seach query with images type (satellite), zoom level and image size
    URL = URL + "&type=sat&zoom=" + zoomLevel + "&size=400,300";

    $.get(URL)
    .then (function ()
    {
        $("#map").attr("src", this.url);
    })
    .catch (function()
    {   // the search request falied
        alert (URL);
        return false;
    });

    return true;
}

function formatAddress(address)
{   // The address received from Zomato is a comma-delimited string.  Reformat that string to a friendlier,
    // more familiar format

    var addr = address.split(",");

    var rString = "";
    var aLength = addr.length;
    var aCount = 0;
    for (var i=0; i<aLength; i++)
    {   rString = rString + addr[i];

        if (aCount < (aLength - 1))
        {   rString = rString + "<br>";
            aCount++;
        }
    };

    return rString;
}

function displayZomato (data, name)
{   // get data from Zomato for the establishment at the specified latitude and longitude
console.log("********************");
console.log("displayZomato()");
    
    var zomatoDiv = $("<div>");
    var headDiv = $("<div>");
    var textDiv = $("<div>");

    var p1 = $("<p>");
    var p2 = $("<p>");
    var p3 = $("<p>");
    var p4 = $("<p>");
    var p5 = $("<p>");
    var p6 = $("<p>");

    zomatoDiv = $("<div>");
    headDiv = $("<div>");
        
    headDiv
        .addClass("div-header")
        .text(data.restaurant.name + " (FourSquare: " + name + ")");

    p1.html(formatAddress(data.restaurant.location.address));
    p3.text(data.restaurant.cuisines);
    p4.text("average cost for 2: " + data.restaurant.currency + data.restaurant.average_cost_for_two);
    p5.text("rated: " + data.restaurant.user_rating.aggregate_rating);
    p6.text(data.restaurant.user_rating.votes + " votes");

    textDiv
        .addClass("div-text")
        .append (p1)
        .append (p2)
        .append (p3)
        .append (p4)
        .append (p5)
        .append (p6);

    zomatoDiv
        .addClass("zomato-site")
        .append(headDiv)
        .append(textDiv);

    $(".foodie-section").append(zomatoDiv);
}

function getZomato (name, latitude, longitude)
{   // get data from Zomato for the establishment at the specified latitude and longitude
console.log("********************");
console.log("getZomato()");
    
//     var queryURL = "https://developers.zomato.com/api/v2.1/search?q=Luna Cleveland&radius=1&count=1"
    var queryURL = "https://developers.zomato.com/api/v2.1/search?count=1&q=" + name +
                   "&lat=" + latitude +
                   "&lon=" + longitude + 
                   "&radius=10000";

    $.ajax(
    {   url: queryURL,
        method: "GET",
        beforeSend: function(xhr)
        {   xhr.setRequestHeader('user-key', '71908c4a0942db243aa61de4a0bff5f2');
        },
    })
    .then(function(response)
    {
        // var zomatoDiv = $("<div>");
        // var headDiv = $("<div>");
        // var textDiv = $("<div>");

        // var p1 = $("<p>");
        // var p2 = $("<p>");
        // var p3 = $("<p>");
        // var p4 = $("<p>");
        // var p5 = $("<p>");
        // var p6 = $("<p>");

        response.restaurants.forEach (function(data)
        {   
        //     zomatoDiv = $("<div>");
        //     headDiv = $("<div>");
            
        //     headDiv
        //         .addClass("div-header")
        //         .text(data.restaurant.name);

        //     p1.html(formatAddress(data.restaurant.location.address));
        //     p3.text(data.restaurant.cuisines);
        //     p4.text("average cost for 2: " + data.restaurant.currency + data.restaurant.average_cost_for_two);
        //     p5.text("rated: " + data.restaurant.user_rating.aggregate_rating);
        //     p6.text(data.restaurant.user_rating.votes + " votes");

        //     textDiv
        //         .addClass("div-text")
        //         .append (p1)
        //         .append (p2)
        //         .append (p3)
        //         .append (p4)
        //         .append (p5)
        //         .append (p6);

        //     zomatoDiv
        //         .addClass("zomato-site")
        //         .append(headDiv)
        //         .append(textDiv);

        //     $(".foodie-section").append(zomatoDiv);
            displayZomato (data, name)
        });
    })
    .catch(function(e)
    { console.log(e);
    });
}

function searchZomato (latitude, longitude)
{   // get data from Zomato for the establishment at the specified latitude and longitude
console.log("********************");
console.log("searchZomato()");
    
    var queryURL = "https://developers.zomato.com/api/v2.1/search?count=5&&lat=" + latitude +
                   "&lon=" + longitude + 
                   "&radius=" + radius;

    $.ajax(
    {   url: queryURL,
        method: "GET",
        beforeSend: function(xhr)
        {   xhr.setRequestHeader('user-key', '71908c4a0942db243aa61de4a0bff5f2');
        },
    })
    .then(function(response)
    {
        // var zomatoDiv = $("<div>");
        // var headDiv = $("<div>");
        // var textDiv = $("<div>");

        // var p1 = $("<p>");
        // var p2 = $("<p>");
        // var p3 = $("<p>");
        // var p4 = $("<p>");
        // var p5 = $("<p>");
        // var p6 = $("<p>");

        var map = [];

        // the first element is the center of the map
        // While testing, use the coordinates of the first item in FourSquare response as the center of the
        // map
        map.push([response.restaurants[0].restaurant.location.latitude, response.restaurants[0].restaurant.location.longitude]);

        response.restaurants.forEach (function(data)
        {   
        //     zomatoDiv = $("<div>");
        //     headDiv = $("<div>");
            
        //     headDiv
        //         .addClass("div-header")
        //         .text(data.restaurant.name);

        //     p1.html(formatAddress(data.restaurant.location.address));
        //     p3.text(data.restaurant.cuisines);
        //     p4.text("average cost for 2: " + data.restaurant.currency + data.restaurant.average_cost_for_two);
        //     p5.text("rated: " + data.restaurant.user_rating.aggregate_rating);
        //     p6.text(data.restaurant.user_rating.votes + " votes");

        //     textDiv
        //         .addClass("div-text")
        //         .append (p1)
        //         .append (p2)
        //         .append (p3)
        //         .append (p4)
        //         .append (p5)
        //         .append (p6);

        //     zomatoDiv
        //         .addClass("zomato-site")
        //         .append(headDiv)
        //         .append(textDiv);

        //     $(".foodie-section").append(zomatoDiv);
            displayZomato (data, name)

            map.push([ data.restaurant.location.latitude,  data.restaurant.location.longitude]);
        });

        getMap (map);
    })
    .catch(function(e)
    { console.log(e);
    });
}

function getFourSquare(lat, lng)
{   


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

    if (lat)
    {   
        if (lng)
        {
            // Can use Latitude Longitude or Near One is requireed
            // var latLon = "41.08,-81.51"
            // var near = "Akron"

            queryURL = "https://api.foursquare.com/v2/venues/explore?client_id="+ client_id +
            "&client_secret=" + client_secret +
            "&ll=" + lat.toString() + "," + lng.toString() +
            "&v=" + version +
            "&section=food&radius="+radius +
            "&limit=5";
        }
        else
        {   
            queryURL = "https://api.foursquare.com/v2/venues/explore?client_id="+ client_id +
            "&client_secret=" + client_secret +
            "&near=" + lat +
            "&v=" + version +
            "&section=food&radius="+radius +
            "&limit=5";
        }
    }
    else
    {
        alert ("Error");
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
        
    $.ajax(
    {   url: queryURL,
        method: "GET"
    })
    .then(function(response)
    {
        
        // create an array for getMap()
        var map = [];

        // the first element is the center of the map
// While testing, use the coordinates of the first item in FourSquare response as the center of the
// map
        map.push([response.response.groups[0].items[0].venue.location.lat, response.response.groups[0].items[0].venue.location.lng]);

        response.response.groups[0].items.forEach(function(data)
        {
            console.log("location: ", data.venue.location.lat, " ", data.venue.location.lng)
            // Send these coordinates to the Zomato function

            getZomato (data.venue.name, data.venue.location.lat,  data.venue.location.lng);

            // and pust them into the array for getMaps()
            map.push([ data.venue.location.lat,  data.venue.location.lng]);

        })

        getMap (map);
    });
}

$(document).ready(function()
{   //
    //

//     getFourSquare("Cleveland");
    getMap ([41.4993, -81.6944]);

    $(".radio-input").on("change", function()
    {   // event handler for the range radio button

        var range = $(this).attr("value");

        radius = 1609 * range;              // there are 1609 meters in a mile

        zoomLevel = 10;                     // 400px images covers ~ 25 miles 
        if (range == 10) zoomLevel = 11;    // 400px images covers ~ 12 miles
        if (range == 5) zoomLevel = 12      // 400px images covers ~ 6 miles

        alert ("zoom level: " + zoomLevel);
//         getMap (loc8s);
    });

    $("#location-button").on("click", function(event)
    {   event.preventDefault();

        // Get data from the form and...
        // - retrieve a map from MapQuest
        // - get data from 

        // getMap() takes 1 parameter -- an array.  This array can have an arbitrary number of elements,
        // but must have at least one.
        //
        // The first element in the array represents the center of the map.  It can be either latituse
        // and longitude or strings with city name and state.
        //
        // The remaining elements represent multiple points of interest.  These must be latitde and
        // longitude.

        if ($("#foursquare:checked").length)
        {   if ($("#input-city").val() != "")
                getFourSquare ($("#input-city").val().trim())
            else
                getFourSquare (41.5043, -81.6084)
        }
        else
        {   searchZomato (41.5043, -81.6084);
        }
    });
})