var locations = [{
    title: 'The Westin',
    location: {
        lat: 18.5396281,
        lng: 73.907227
    }
}, {
    title: 'German Bakery',
    location: {
        lat: 18.542583,
        lng: 73.8877385
    }
}, {
    title: 'Hyatt Pune',
    location: {
        lat: 18.553104,
        lng: 73.903938
    }
}, {
    title: 'Cybage Software',
    location: {
        lat: 18.546228,
        lng: 73.910933
    }
}, {
    title: 'Aga Khan Palace',
    location: {
        lat: 18.552006,
        lng: 73.900204
    }

}];

var styles = [{
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#444444"
    }]
}, {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [{
        "color": "#f2f2f2"
    }]
}, {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road",
    "elementType": "all",
    "stylers": [{
        "saturation": -100
    }, {
        "lightness": 45
    }]
}, {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [{
        "visibility": "simplified"
    }]
}, {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "water",
    "elementType": "all",
    "stylers": [{
        "color": "#46bcec"
    }, {
        "visibility": "on"
    }]
}];

function LocationsViewModel() {
    var self = this;

    self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: k_nagar,
        styles: styles
    });

    self.obsLocations = ko.observableArray(locations);

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

ko.applyBindings(new LocationsViewModel());
