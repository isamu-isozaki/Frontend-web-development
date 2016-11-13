"use strict";
var Marker = function() {
    var self = this;
    self.place = ko.observableArray(); //holds the places
    self.shown = ko.observableArray(); //holds the visible places
    self.markers = ko.observableArray(); //holds the markers
    self.map = new google.maps.Map(document.getElementById('map'), {}); //makes a new google map
}; //shown and markers should be the same length
var InfoWin = function() {
    var self = this;
    self.infoWindow = new google.maps.InfoWindow();
    self.content = ko.observableArray(); //stores the contents so there is no need to create each infoWindow more than once
    self.createContent = function(venue) { //creates the content of the infoWindow
        var address = '';
        if (venue.location.formattedAddress) { //if formattedAddress exists
            for (var i = 0; i < venue.location.formattedAddress.length; i++) {
                if (venue.location.formattedAddress[i] !== null) { //as long as formattedAddress isn't undefined
                    if (i == venue.location.formattedAddress.length - 1) { //if i is at the end of the array
                        address += venue.location.formattedAddress[i]; //no comma
                    } else {
                        address += venue.location.formattedAddress[i] + ', '; //with comma
                    }
                }
            }
        }
        var content = '<div class = "infoWin">' +
            '<div class = "container-fluid">' +
            '<div class="row">' +
            '<div class = "col-md-2">' +
            '<img src = "' +
            venue.categories[0].icon.prefix + 32 + venue.categories[0].icon.suffix +
            '" alt = "' +
            venue.categories[0].pluralName +
            '">' +
            '</div>' +
            '<div class = "col-md-10">' +
            '<div class = "title">' + venue.name +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class = "info">' +
            '<div class = "row">' +
            '<div class = "col-md-12 category">' +
            'Category: ' + venue.categories[0].pluralName +
            '</div>' +
            '</div>' +
            '<div class = "row">' +
            '<div class = "col-md-12 Now">' +
            'Availability: ' + ((venue.hours === null) ? ('This information is unavailable') : ('Currently, it is ' + (venue.hours.isOpen ? 'open' : 'closed'))) +
            '</div>' +
            '</div>' +
            '<div class = "row">' +
            '<div class = "col-md-12">' +
            'Phone Number: ' + ((venue.contact.formattedPhone === null) ? 'This information is unavailable' : venue.contact.formattedPhone) +
            '</div>' +
            '</div>' +
            '<div class = "row">' +
            '<div class = "col-md-12">' +
            'Address: ' + address +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class = "rating">' +
            '<div class = "row">' +
            '<div class = "col-md-8">' +
            '<div class = "stars">' + venue.rating / 2 + '</div>' +
            '</div>' +
            '<div class = "col-md-4">' +
            '<div class = "stats">' + venue.rating / 2 + '/5' + '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'; //holds the content
        self.content.push(content); //push to self.content
    };
    self.closeInfo = function() { //close info window
        self.infoWindow.close();
    };
};
var List = function() {
    var self = this;
    self.list = ko.observableArray(); //list these in the list view
    self.isScrolledIntoView = function(elem) {//check if the desired element is in view
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));// Thanks to http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling!
    };
};
var ViewModel = function() {
    var self = this;
    var $content = $('#content');
    var $nav = $('#nav');
    var $map = $('#map');
    var $list = $('#list');
    var $attribution = $('.attribution');
    var $toggle = $('.toggle');
    self.marker = ko.observable(new Marker());
    self.list = ko.observable(new List());
    self.infoWin = ko.observable(new InfoWin());
    self.typed = ko.observable(''); //holds the typed value in the search box
    self.bounds = new google.maps.LatLngBounds(); //defines the bounds of google map
    self.selectList = function(index) {//selects an element from the list
        var $list = $('#list');
        if($list.css('display') != 'none') {
            var $list_item = $('.list-group-item');
            var $map = $('#map');
            var $search = $('.search');
            for (var i = 0; i < $list_item.length; i++) {
                $list_item[i].className = 'list-group-item'; //remove the active class from an element that has it
            }
            var item;
            if($list_item.length == self.marker().markers().length)//if the list has not been filtered
                item = $list_item[index];
            else{
                for(var j = 0; j < $list_item.length; j++) {
                    if(self.marker().markers()[index].getTitle() == $list_item[j].innerHTML) {//since .text() is not working
                        item = $list_item[j];//select the list item that match's the marker the user clicked on
                    }
                }
            }
            item.className = 'list-group-item active'; //set the new active class to the selected one
            $search[0].scrollIntoView($map[0].scrollIntoView(item.scrollIntoView(true)));//scroll all these into view
            if(!self.list().isScrolledIntoView(item)) {//if the list wasn't scrolled into view
                var $list_group = $('.list-group');
                $list_group.height($(window).height() - $map.height() - $search.height());
                item.scrollIntoView(true);//so that users doesn't have to scroll down to see the list elements if they failed to scroll into view
            }
        }

    };
    self.compose = function() {//in charge of setting up the composition of the site
        $content.height($(window).height() - $nav.height()); //so that the whole app fits in a page and doesn't require the user to scroll down
        $content.width($nav.width());
        $map.height($content.height());
        $list.height($content.height());
        $attribution.css({'top': $map.position().top + $map.outerHeight(true) - $attribution.height(), 'left': ($map.outerWidth() - $attribution.width())/2});
    };
    self.setBounds = function() { //set the bounds of the map
        self.bounds = new google.maps.LatLngBounds(); //return bounds to default
        for (var i = 0; i < self.marker().markers().length; i++) { //for every marker
            var markerName = self.marker().markers()[i].getTitle();
            for (var j = 0; j < self.marker().shown().length; j++) { //should be the same length
                if (markerName == self.marker().shown()[j].venue.name) { //for every self.marker(), iterate over self.marker().shown() and see if they have matching names for the locations
                    self.marker().markers()[i].setMap(self.marker().map); //for those that match make them visible on the map
                    self.bounds.extend(self.marker().markers()[i].getPosition()); //extend the bound accordingly
                }
            }
        }
    };
    self.openInfo = function(i) { //open infoWindow with stars
        self.infoWin().infoWindow.setContent(
            self.infoWin().content()[i]
        );
        self.infoWin().infoWindow.open(self.marker().map, self.marker().markers()[i]); //add an info window
        $('.stars').each(function() { // Courtesy of http://stackoverflow.com/questions/1987524/turn-a-number-into-star-rating-display-using-jquery-and-css
            // Get the value
            var val = parseFloat($(this).html()); //make rating out of 5 rather than out of 10
            // Make sure that the value is in 0 - 5 range, multiply to get width
            var size = Math.max(0, (Math.min(5, val))) * 30; //if val is a negative quantity evaluate size to 0 while if it is greater than 5 than evaluate size to 5
            // Create stars holder
            var $div = $('<div></div>').width(size); //set the width as size
            // Replace the numerical value with stars
            $(this).html($div); //create the div with the star background in the div that has an empty star background
        });
        $('.infoWin').addClass('animated zoomIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass('animated zoomIn');
        });
    };
    self.clicked = function(i) {
        self.marker().markers()[i].setAnimation(google.maps.Animation.BOUNCE); //do a bouncing animation
        self.openInfo(i); //open infoWindow at marker's location

        self.selectList(i); //just in case this function is called from a click on marker, if so set the corresponding list element as active
        window.setTimeout(function() {
            self.marker().markers()[i].setAnimation(null); //stop the animation after 1400ms
        }, 1400);
    };
    self.openListInfo = function(index) { //whenever a list element is clicked
        self.infoWin().closeInfo(); //close the current self.infoWin().infoWindow
        var text = self.marker().shown()[index()]; //get the text the user wanted to be detected
        self.selectList(index()); //set the list the user clicked on as active and if needed scroll into view
        for (var i = 0; i < self.marker().place().length; i++) { //for every place
            var place = self.marker().place()[i];
            if (place == text) { //if the list if the selected elements location is the same as the one found in place
                self.clicked(i); //open a infoWindow on the map at the markers location and perform an animation on the marker
            }
        }
    };
    self.init = function() {
        var $search = $('#searchBox');
        $search.keypress(function(e) {
            if (e.keyCode == 10 || e.keyCode == 13) {
                e.preventDefault(); //disable the enter key
            }
        });
        $attribution.css('pointer-events', 'none');//so that if this was covering some markers it wouldn't affect users from interacting with that particular marker
        $toggle.parent().css('padding', '0');
        $search.height($('.filter').outerHeight(true));
        $toggle.parent().height($search.height());
        $toggle.height($search.height());
        self.compose();
        google.maps.event.addDomListener(window, 'resize', function() {//if the user resized the window
            self.compose();
            var center = self.marker().map.getCenter();
            google.maps.event.trigger(self.marker().map, 'resize');
            self.marker().map.setCenter(center);
            self.marker().map.setCenter(self.bounds.getCenter());
            self.marker().map.fitBounds(self.bounds);
            if($(window).width() > 768) {//if screen size is larger than an Ipad when it is upright
                $list.css('display', 'block');//show the list regardless of the toggle
            }
        });
        google.maps.event.addListener(self.marker().map, 'click', function() {
            self.infoWin().closeInfo();
        });
        google.maps.event.addListener(self.marker().map, 'drag', function() {
            self.infoWin().closeInfo();
        }); //on clicking or draging anything that is not the self.marker() except for the list view causes the self.infoWin().infoWindow to close
        $toggle.click(function() {//manipulate to cause the list view to toggle on and off
            if($list.css('display') != 'none') {//if it was visible
                $list.css('display', 'none');//Viola! Make it disappear
            } else {
                $list.css('display', 'block');//else make it appear
            }
        });
        self.getLoc(); //get location of user
    };
    self.getLoc = function() {
        navigator.geolocation.getCurrentPosition(self.makeMarkers); //get user's location
    };
    self.makeMarkers = function(pos) {
        self.marker().map.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }); //set the center of the map
        $.ajax({ //gets data from the foursquare api regarding places near the user's location
            type: 'GET',
            url: 'https://api.foursquare.com/v2/venues/explore?ll=' + pos.coords.latitude + ',' + pos.coords.longitude + '&client_id=JXT5UDU55NGTZEKRTFHYQ1VHDEZG2QEPGSBU3OKC4KIEO0RF&client_secret=GQQVHCUA125JOV0GTFV4AMNOIMB0PZUQISEV402XPZWTO0NF&v=20160613&radious = 2000',
            success: function(data) {
                var places = data.response.groups[0].items;
                for (var i = 0; i < places.length; i++) {
                    self.marker().place().push(places[i]); //sends the data to the self.marker() in the place array
                }
                self.checkVisible(); //calls checkVisible which checks if the places match the typed value in the search box
                for (var j = 0; j < self.marker().place().length; j++) {
                    self.infoWin().createContent(self.marker().place()[j].venue);
                }
            },
            error: function() {
                $.getJSON('./js/myPlaces.json', function(data){
                    self.marker().place(data);//JSON.stringified and pasted this. It will not constantly update yet it will do
                    //my neighborhood at 12:00
                    $('.pagetitle h1').text('Welcome to my Neighborhood!(The foursquare api failed to work)');
                    self.checkVisible(); //calls checkVisible which checks if the places match the typed value in the search box
                    for (var j = 0; j < self.marker().place().length; j++) {
                        self.infoWin().createContent(self.marker().place()[j].venue);
                    }
                });
            }
        });
    };
    self.updateCheck = self.typed.subscribe(function() {
        self.checkVisible(); //whenever self.typed() changes calls checkVisible
    });
    self.checkVisible = function() {
        var pre = self.marker().shown();
        if (self.typed() === '') { //if nothing is typed
            self.marker().shown(self.marker().place()); //all the markers are shown
        } else { //if there is something in the search box
            self.marker().shown(_.filter(self.marker().place(), function(obj) {
                var name = obj.venue.name.toLowerCase();
                return name.indexOf(self.typed().toLowerCase()) != -1;
            })); //shown will be an array of all the possible places
        }
        if (self.marker().shown().length === 0) { //if the user inputs gibberish in the search box, hence if there is no match
            self.marker().shown(self.marker().place()); //all the markers are shown
        }
        pre !== self.marker().shown() ? self.deploy(): null;//deploy the markers
    };
    self.deploy = function() {
        //courtesy of http://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-visible-place
        if (self.marker().markers().length > 0) {
            for (var i = 0; i < self.marker().markers().length; i++) {
                self.marker().markers()[i].setMap(null); //first don't show any markers on the map
            }
        }
        if (self.marker().markers().length < self.marker().shown().length) {
            self.marker().markers([]); //clear markers
            for (var j = 0; j < self.marker().shown().length; j++) { //for every specified viewable self.marker()
                var obj = self.marker().shown()[j];
                var marker = new google.maps.Marker({
                    position: { lat: obj.venue.location.lat, lng: obj.venue.location.lng },
                    title: obj.venue.name,
                    map: self.marker().map,
                    animation: google.maps.Animation.DROP
                });
                self.marker().markers().push(marker); //create markers and send them to markers
                self.bounds.extend(marker.getPosition()); //extend the bounds accordingly
            }
        } else {
            self.setBounds();
        }
        self.list().list([]); //so that list() will not have any pre-existing elements
        for (var l = 0; l < self.marker().shown().length; l++) {
            self.list().list.push(self.marker().shown()[l].venue.name);
        }

        for (var k = 1; k < self.marker().markers().length; k++) {
            //self.list().list().push(self.marker().markers()[i].getTitle());//send the names to list view(Doesn't update it)
            self.marker().markers()[k].addListener('click', (function(iCopy) { //on clicking the self.marker()
                return function() {
                    self.clicked(iCopy); //do an animation on the marker and open an infoWindow also set the corresponding element in the list as acrive
                };
            })(k));
        }
        self.marker().map.setCenter(self.bounds.getCenter());
        self.marker().map.fitBounds(self.bounds); //modify the bounds to fit the markers accordingly
    };
};


function initMap() { //callback function of google maps api
    var vm = new ViewModel();
    vm.init();
    ko.applyBindings(vm);
}

function mapError() {
    $('.pagetitle h1').text('Sorry, Google Map API failed to load');
}