

var mymap = L.map("mapid").setView([40.91443, -74.17075], 12);
var Esri_WorldStreetMap = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
  }
).addTo(mymap);
//add in the basemap

var coordinates = [];
var type1;
//create the feature group to be drawn and add the mto the map
var drawnItems = new L.FeatureGroup();
mymap.addLayer(drawnItems);
var osmGeocoder = new L.Control.OSMGeocoder({placeholder: 'Search location...'});
mymap.addControl(osmGeocoder);
//create a control variable
var drawControl = new L.Control.Draw({
  //set the drawing settings, we are not drawing polylines, polygons, or circles
	position: 'topright',
	draw: {
		polyline:false,
		polygon:false,
		circle: false, // Turns off this drawing tool
		rectangle: {
      allowIntersection: false,
      showArea: true,
      drawError: {
          color: '#b00b00',
          timeout: 1000
			}
		},
		marker: true
	},
	edit: {
		featureGroup: drawnItems, //REQUIRED!!
		remove: true
	}
});
//add teh control to the map
mymap.addControl(drawControl);
// when a feature is created,perform these functions
mymap.on('draw:created', function (e) {
  //set the type of the layer
  var type = e.layerType;
  //set the layer variable
  var layer = e.layer;
  //if there is already a feature in drawnitedms, delete it
  if (drawnItems && drawnItems.getLayers().length !== 0) {
    drawnItems.clearLayers();
  }
  //add the new layer to drawnitems
  drawnItems.addLayer(layer);
  //create an empty list for the coordinates

  //if the feature is a rectangle
  if (type == "rectangle") {
    //get the coordinates
    latlngs = layer.getLatLngs();
    console.log(latlngs[0].length);
    //push those coordinates into the coordinates list
    for (var i = 0; i < latlngs[0].length; i++) {
      var values = Object.values(latlngs[0][i]);
      console.log(values);
      coordinates.push(values);
    }
  }
  //if the type is a marker
  if (type == "marker") {
    //get the coordinates
    latlngs = layer.getLatLng();
    //push them into the coordinates list
    console.log(latlngs);
    coord = [];
    var keys = Object.values(latlngs);
    console.log(keys);

    coordinates.push(keys);
  }

  //create a popup with a submit button to be created with the marker
  var popupContent =
    '<form id = "form1">' +
    '<div class = "form-group"' +
    '<div style = "text-align:center;" class = "col-xs-4"><button type = "submit" id = "sub2" value = "submit" class = "btn btn-dark">Select Feature</button></div>' +
    "</div>" +
    "</form>";
  //add the popup
  layer
    .bindPopup(popupContent, {
      keepinView: true,
      closeOnClick: true,
    })
    .openPopup();
    $("#sub2").on('click',function(e) {
      e.preventDefault();
      if(type == 'rectangle') {
        type1 = 'rectangle'
      } else {
        type1 = 'marker'
      }
      layer.closePopup();
    })
});

var features = [];
var featureClass = {};
//when the submit button is pressed
$("#submit").on("click", function (f) {
  //prevent it from automatically submitting

  //create the geojson variable
  var geojson = {};
  console.log(coordinates);
  //if the type is rectangle
  if (type1 == "rectangle") {
    console.log("success");
    //create each aspect of the geojson
    geojson["type"] = "Feature";
    geojson["geometry"] = {};
    geojson["geometry"]["type"] = "Polygon";
    geojson["properties"] = {};

    var newcoords = [];
    geojson["properties"]["ID"] = $("#ID").val();
    for (var x = 0; x < coordinates.length + 1; x++) {
      if (x == coordinates.length) {
        newcoords.push([coordinates[0][1], coordinates[0][0]]);
      } else {
        newcoords.push([coordinates[x][1], coordinates[x][0]]);
      }
    }
    geojson["geometry"]["coordinates"] = [newcoords];
    features.push(geojson);
  }
  //if the type is a marker
  if (type1 == "marker") {
    //create each aspect of the geojson
    geojson["type"] = "Feature";
    geojson["geometry"] = {};
    geojson["properties"] = {};
    geojson["geometry"]["type"] = "Point";
    geojson["geometry"]["coordinates"] = [coordinates[0][1], coordinates[0][0]];
    geojson["properties"]["ID"] = $("#ID").val();
    features.push(geojson);
  }
 
  featureClass["type"] = "FeatureCollection";
  featureClass["features"] = features;
  var json = JSON.stringify(featureClass);
  $("#geocode").val(json);
  console.log(json);
});
