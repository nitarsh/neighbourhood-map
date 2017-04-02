var locations = [{
    title: 'Effingut Brewerkz',
    location: {
        lat: 18.533908,
        lng: 73.898698
    }
}, {
    title: 'German Bakery',
    location: {
        lat: 18.5397816,
        lng: 73.8871946
    }
}, {
    title: 'Euriska',
    location: {
        lat: 18.537305,
        lng: 73.908642
    }
}, {
    title: 'Gandharv',
    location: {
        lat: 18.544868,
        lng: 73.911153
    }
}, {
    title: 'Marrakesh',
    location: {
        lat: 18.548791,
        lng: 73.905676
    }
}, {
    title: 'Exotica',
    location: {
        lat: 18.553095,
        lng: 73.892690
    }
}, {
    title: 'La Terrazza',
    location: {
        lat: 18.557114,
        lng: 73.911186
    }
}];

// function to make Marker Icon given the color. Taken from Udacity example code
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

// Once again, reusing function provided in the examples
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent(constructInfoWindow(marker.title, 'Loading info, please wait'));
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });

        function constructInfoWindow(title, para, pic_url) {
            if (pic_url) {
                return '<div class="info-window"><h4>' + title + '</h4>' +
                    '<img src="' + pic_url + '" alt="' + title + ' picture" height="42px" width="42px">' +
                    '<p> Cuisines: ' + para + '</p></div>';
            }
            return '<div class="info-window"><h4>' + title + '</h4>' + '<p>' + para + '</p></div>';
        };


        // we need the location to narrow down the results
        function getZomatoData(title, location) {
            var data = null;
            var xhr = new XMLHttpRequest();

            xhr.onload = function() {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        console.log(response);
                        if (response.results_found > 0) {
                            var data = response.restaurants[0].restaurant;
                            console.log(data);
                            infowindow.setContent(constructInfoWindow(marker.title, data.cuisines, data.thumb));
                        } else {
                            infowindow.setContent(constructInfoWindow(marker.title, 'SORRY! No results found for this location'));
                        }
                    } else {
                        infowindow.setContent(constructInfoWindow(marker.title, 'SORRY! Error connecting to Zomato'));
                    }
                }
            };



            var url = "https://developers.zomato.com/api/v2.1/search?";
            var q_params = "radius=100&lat=" + location.lat() + "&lon=" + location.lng() + "&q=" + title;

            xhr.open("GET", url + q_params);
            xhr.setRequestHeader("user-key", "75a4b78b20378521dae67a97a4fb168d");

            xhr.send(data);
        };

        getZomatoData(marker.title, marker.position);

        infowindow.open(map, marker);
    }
}

function LocationsViewModel() {
    var self = this;

    self.obsLocations = ko.observableArray(locations);

    self.initMarkers = function() {
        // create icons
        var defaultIcon = makeMarkerIcon('11E165');
        var highlightedIcon = makeMarkerIcon('FF9013');
        var newIcon = "images/food_black.svg";

        for (var i = 0; i < locations.length; i++) {
            // Get the position from the location array.
            var position = locations[i].location;
            var title = locations[i].title;
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                icon: newIcon,
                id: i,
                map: map
            });

            // Create an onclick event to open the large infowindow at each marker.
            marker.addListener('click', function() {
                populateInfoWindow(this, new google.maps.InfoWindow());
            });
            // Two event listeners - one for mouseover, one for mouseout,
            // to change the colors back and forth.
            // this code below is also taken from the example code provided
            marker.addListener('mouseover', function() {
                this.setIcon(highlightedIcon);
            });
            marker.addListener('mouseout', function() {
                this.setIcon(defaultIcon);
            });
        }
    }

    self.addLocation = function(title, location) {
        self.obsLocations.push({
            title: title,
            location: location
        });
    };

    self.removeLocation = function() {
        self.obsLocations.remove(this);
    }
}

// putting this in window object so we can access this from everywhere
lvm = new LocationsViewModel();
ko.applyBindings(lvm);
