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

function getTitleArray(locations) {
    output = [];
    for (i = 0; i < locations.length; i++) {
        output.push({
            title: locations[i].title
        });
    }
    return output;
}

// Once again, reusing function provided in the examples
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.setContent(constructInfoWindow(marker.title, 'Loading info, please wait'));
        infowindow.marker = marker;
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });

        function constructInfoWindow(title, para, pic_url) {
            if (pic_url) {
                return '<div class="info-window"><h4>' + title + '</h4>' +
                    '<div><img src="' + pic_url + '" alt="' + title + ' picture" height="42px" width="42px">' +
                    '<p><b> Cuisines:</b> ' + para + '</p></div></div>';
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
                        if (response.results_found > 0) {
                            var data = response.restaurants[0].restaurant;
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
    return infowindow;
}

function LocationsViewModel() {
    var self = this;

    self.obsLocations = ko.observableArray(locations);

    self.filterString = ko.observable("");

    self.filteredTitles = ko.observableArray(getTitleArray(locations));

    self.initMarkers = function() {
        self.markers = {};
        // create icons
        var defaultIcon = "images/food_black.svg";
        var highlightedIcon = "images/food_blue.svg";

        for (var i = 0; i < locations.length; i++) {
            var position = locations[i].location;
            var title = locations[i].title;
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                icon: defaultIcon,
                id: i,
                map: map
            });

            marker.addListener('click', function() {
                // first close last opened window if present
                if (self.openedInfoWindow) {
                    self.openedInfoWindow.marker.setIcon(defaultIcon);
                    self.openedInfoWindow.close();
                }
                self.openedInfoWindow = populateInfoWindow(this, new google.maps.InfoWindow());
                this.setIcon(highlightedIcon);
            });
            self.markers[title] = marker;
        }
    };


    self.clickLocation = function(location) {
        google.maps.event.trigger(self.markers[location.title], 'click');
    };

    // Sets the map on all markers in the array.
    // Taken from https://developers.google.com/maps/documentation/javascript/examples/marker-remove
    function hideAllMarkers() {
        Object.keys(self.markers).forEach(function(title) {
            self.markers[title].setMap(null);
        });
    }

    // based on the updates to the filter input, we
    self.filterString.subscribe(function(newValue) {
        // console.log("search value: " + newValue);
        self.filteredTitles.removeAll();
        hideAllMarkers();
        self.obsLocations().forEach(function(e) {
            if (e.title.toLowerCase().includes(newValue.toLowerCase())) {
                self.filteredTitles.push({
                    title: e.title
                });
                self.markers[e.title].setMap(map);
            }
        });
        // console.log("Filtered value: " + self.filteredTitles());
    });
}

// putting this in window object so we can access this from everywhere
lvm = new LocationsViewModel();
ko.applyBindings(lvm);
