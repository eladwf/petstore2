
$(document).on("pageinit", "#MapPage", function () {
   

    geocoder = new google.maps.Geocoder();

    var myTrip = new Array();
    var defaultLatLng = new google.maps.LatLng(32.0983425, 34.87);
    if (navigator.geolocation) {
        function success(pos) {
            // Location found, show map with these coordinates
            
            var myloc = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            drawMap(myloc);
            getshops(function (data) {
                if (data["d"] != undefined) {
                    var shops = [];
                    for (var i = 0; i < data["d"].length; i++)
                        shops.push(data["d"][i])
                }
                
                calcdist(myloc,shops);

                drawmarkers(myloc,shops);
            });
           
        }
        function fail(error) {

            drawMap(defaultLatLng);  // Failed to find location, show default map

            getshops(function (data) {
                if (data["d"] != undefined) {
                    var shops = [];
                    for (var i = 0; i < data["d"].length; i++)
                        shops.push(data["d"][i])
                }
               

                drawmarkers(defaultLatLng, shops);
            });
            
            $('#message').text("Couldn't get location");
        }
        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, { maximumAge: 500000, enableHighAccuracy: true, timeout: 6000 });
    } else {
        drawMap(defaultLatLng);  // No geolocation support, show default map
        drawmarkers(defaultLatLng);
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

    function codeAddress(shops,callback) {


        
        var arr = [];

        for (var i = 0; i < shops.length; i++)
            geocoder.geocode({ 'address': shops[i].Adress }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    lat = results[0].geometry.location.lat();
                    lng = results[0].geometry.location.lng();
                    arr.push({ lat: lat, lng: lng })
                    if (arr.length == shops.length) {

                        callback(arr);

                    }
                } else {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            });


    }

    function drawmarkers(loc,shops) {
        

        debugger;

        codeAddress(shops,function (arr) {
            var map = new google.maps.Map(document.getElementById("gmap_canvas"), {
                zoom: 10,
                center: loc,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            var infowindow = new google.maps.InfoWindow();
            var title = '</br><strong>location</strong></br>';
            var add;
            var i = 0;
            for (i = 0; i < shops.length; i++) {

                add = title + shops[i].Name + '</br>' + shops[i].Adress + '</br>';
               
                createMarker(add, arr[i].lat, arr[i].lng, infowindow, map, i);
            }
           
            var marker = new google.maps.Marker({
                position: loc,
                map: map,
            });
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {

                    infowindow.setContent('<br><h3>my  location</h3>');
                    infowindow.open(map, marker);
                }
            })(marker, i));
        });
       

    }

    function calcdist(myloc,shops) {


        codeAddress(shops,function (arr) {

            var distances = [];
            // var map = new google.maps.Map(document.getElementById("gmap_canvas"), {
            //   zoom: 10,
            //    center: myloc,
            //   mapTypeId: google.maps.MapTypeId.ROADMAP
            // });
            debugger;

            var infowindow = new google.maps.InfoWindow();
            var title = '</br><strong>location</strong></br>';
            var add;
            for (var i = 0; i < arr.length; i++) {

                add = title + shops[i].Name + '</br>' + shops[i].Adress + '</br>';
                distances.push(google.maps.geometry.spherical.computeDistanceBetween(myloc, new google.maps.LatLng(arr[i].lat, arr[i].lng)));
                //createMarker(add, arr[i].lat, arr[i].lng, infowindow, map, i);
               
                
            }

            var x = getmin(distances);

            minimumindex = distances.indexOf(x);
            $('#message').text(shops[minimumindex].Name);
            $('#address').text(shops[minimumindex].Adress);

        });

    }

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
});