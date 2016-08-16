$(document).on("pageinit", "#MapPage", function () {
    geocoder = new google.maps.Geocoder();

    var myTrip = new Array();
    var defaultLatLng = new google.maps.LatLng(34.0983425, -118.3267434);  // Default to Hollywood, CA when no geolocation support
    if (navigator.geolocation) {
        function success(pos) {
            // Location found, show map with these coordinates
            var myloc = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            drawMap(myloc);
            calcdist(myloc);
        }
        function fail(error) {
            drawMap(defaultLatLng);  // Failed to find location, show default map
            $('#message').text("Couldn't get location");
        }
        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, { maximumAge: 500000, enableHighAccuracy: true, timeout: 6000 });
    } else {
        drawMap(defaultLatLng);  // No geolocation support, show default map
    }
    function drawMap(latlng) {


        var myOptions = {
            zoom: 10,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("gmap_canvas"), myOptions);
        // Add an overlay to the map of current lat/lng

    }

    function codeAddress(callback) {
        var shops = getshops();


        var arr = [];
        for (var i = 0; i < shops.length; i++)
            geocoder.geocode({ 'address': shops[i].Adress }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    debugger;
                    lat = results[0].geometry.location.lat();
                    lng = results[0].geometry.location.lng();
                    arr.push({ lat: lat, lng: lng })
                    callback(arr);
                } else {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            });


    }


    function calcdist(myloc) {


        codeAddress(function (arr) {

            var shops = getshops();
            if (arr.length == shops.length) {
                var distances = [];
                var map = new google.maps.Map(document.getElementById("gmap_canvas"), {
                    zoom: 10,
                    center: myloc,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                var marker;
                var infowindow = new google.maps.InfoWindow();
                var title = '</br><strong>location</strong></br>';
                var add;
                for (var i = 0; i < arr.length; i++) {

                    add = title + shops[i].Name + '</br>' + shops[i].Adress + '</br>';
                    distances.push(google.maps.geometry.spherical.computeDistanceBetween(myloc, new google.maps.LatLng(arr[i].lat, arr[i].lng)));
                    createMarker(add, arr[i].lat, arr[i].lng, infowindow, map, i);
                }

                var x = getmin(distances);

                minimumindex = distances.indexOf(x);
                $('#message').text(shops[minimumindex].Name);
                $('#address').text(shops[minimumindex].Adress);

            }

        });

    }

});

function createMarker(add, lat, lng, infowindow, map, i) {

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
    });
    google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {

            infowindow.setContent(add);
            infowindow.open(map, marker);
        }
    })(marker, i));



}
var getmin = function (values) {
    if (values.length == 0)
        return -1;
    var min = values[0];
    for (var i = 1; i < values.length; i++)
        if (min > values[i])
            min = values[i];
    return min;
}