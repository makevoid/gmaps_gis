var baloon, color_field, debug, gmap, handle_color, label, locations, map_init, marker_place, markers;

gmap = null;

baloon = null;

locations = null;

map_init = function() {
  var mapDiv;
  mapDiv = $("#map");
  gmap = new google.maps.Map(mapDiv.get(0), {
    center: new google.maps.LatLng(0, 20),
    zoom: 3,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });
  return google.maps.event.addListenerOnce(gmap, "tilesloaded", markers);
};

markers = function() {
  baloon = new google.maps.InfoWindow({
    content: 'not loaded...'
  });
  return $.getJSON("/locations/" + data_name + ".json", function(locations) {
    var loc, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = locations.length; _i < _len; _i++) {
      loc = locations[_i];
      _results.push(marker_place(loc));
    }
    return _results;
  });
};

label = function(object, value) {
  if (object[value]) {
    return "<p><strong>" + (value.replace(/_/, " ")) + ":</strong> " + object[value] + "</p>";
  } else {
    return "";
  }
};

color_field = "color";

debug = 0;

handle_color = function(loc) {
  return loc[color_field];
};

marker_place = function(loc) {
  var color, image, latLng, marker, size;
  if (!loc.lat) {
    return;
  }
  color = handle_color(loc);
  if (color === "pink") {
    return;
  }
  size = "med";
  if (loc.grandi) {
    size = "big";
  }
  image = "/img/marker_" + size + "_" + color + ".png";
  latLng = new google.maps.LatLng(loc.lat, loc.lng);
  marker = new google.maps.Marker({
    position: latLng,
    map: gmap,
    icon: image
  });
  return google.maps.event.addListener(marker, 'click', function() {
    console.log(loc);
    baloon.setContent("<p><strong>" + loc.location_name + "</strong></p>    " + (label(loc, "group_number")));
    baloon.open(gmap, this);
  });
};

$(function() {
  return map_init();
});
