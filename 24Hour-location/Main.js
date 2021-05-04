var mymap = L.map("mapid").setView([40.91443, -74.17075], 12);

var Pcoords = {};
var Rcoords2 = {};
//add in the basemap
var Esri_WorldStreetMap = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
  }
).addTo(mymap);
var attributelist = [];
var loctype;
var named;
var frequency;
var keyid = 0;
var feat = {};

//create the feature group to be drawn and add the mto the map
var drawnItems = new L.FeatureGroup();
mymap.addLayer(drawnItems);

//mymap.addLayer(drawnItems);
var osmGeocoder = new L.Control.OSMGeocoder({placeholder: 'Search location...'});
mymap.addControl(osmGeocoder);
// create a control variable
var drawControl = new L.Control.Draw({
  //set the drawing settings, we are not drawing polylines, polygons, or circles
	position: 'topright',
	draw: {
		polyline:false,
		polygon: {
			allowIntersection: false, // Restricts shapes to simple polygons
			drawError: {
				color: '#e1e100', // Color the shape will turn when intersects
				message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
			},
			shapeOptions: {
				color: '#bada55'
			}
		},
		circle: false, // Turns off this drawing tool
		rectangle: false,
		marker: true
	},
	edit: {
		featureGroup: drawnItems, //REQUIRED!!
		remove: true,
    moveMarkers: false,
    edit: false // centroids, default: false
	}
});
// drawControl.setDrawingOptions({rectangle:{shapeOptions:{clickable:true}}})
 
//add teh control to the map
L.drawLocal.draw.toolbar.buttons.polygon = 'place at least three points for your polygon and click the finish button on the toolbar'

mymap.addControl(drawControl);

mymap.on('draw:created', function (e) {
  //set the layer type
  var type = e.layerType;
  //set the layer value
  var layer = e.layer;
  //add the new layer to drawn items
  drawnItems.addLayer(layer);
  if (type == "marker") {
    latlngs = layer.getLatLng();
    var values = Object.values(latlngs);
    Pcoords[keyid] = values;
    console.log(Pcoords)
  }
  if (type == "rectangle") {
    var values = [];
    latlngs = layer.getLatLngs();
    console.log(typeof latlngs[0]);
    var Rcoords = [];
    for (var i = 0; i < 5; i++) {
      if (i == 4) {
        values = Object.values(latlngs[0][0]);
      } else {
        values = Object.values(latlngs[0][i]);
      }
      Rcoords.push(values);
    }
    Rcoords2[keyid] = Rcoords;
  }
  //create a popup with a submit button to be created with the marker
  var popupContent =
    '<form id = "form1">' +
    '<div class = "form-group"' +
    '<div style = "text-align:center;" class = "col-xs-4"><input type = "text" id = "LocType"  placeholder = "Location Type"/></div>' +
    '<div style = "text-align:center;" class = "col-xs-4"><input type = "text" id = "Name"  placeholder = "Location Name"/></div>' + 
    '<div style = "text-align:center;" class = "col-xs-4"><input type = number id = "frequency" value = 0 placeholder = "Frequency per week"/></div>' +
    '<div style = "text-align:center;" class = "col-xs-4"><button type = "submit" id="sub2" class = "btn btn-secondary">Submit Feature</button></div>'
    "</div>" +
    "</form>";
  //add the popup
  layer
    .bindPopup(popupContent, {
      keepinView: true,
      closeOnClick: true,
    })
    .openPopup();
    $("#sub2").on('click', function(e) {

      e.preventDefault();
      console.log('I work')
      loctype = $('#LocType').val();
      named = $('#Name').val();
      frequency = $("#frequency").val();
      feat[keyid] = [loctype,named,frequency];
      console.log(feat[keyid])
      keyid = keyid + 1;
      layer.closePopup();
  });
});

var features = [];
var featureClass = {};
$("#submit").on("click", function (e) {

for (key in Object.keys(feat)) {
  console.log(key)


  var geojson = {};
  geojson["type"] = "Feature";
  geojson["geometry"] = {};
  for (pkey in Object.keys(Pcoords)) {
    
    if(pkey == key) {
      coord = Pcoords[key]

      geojson['geometry']['type'] = 'Point';
      geojson['properties'] = {};
      geojson['properties']['FID'] = key;
      geojson['properties']['loctype'] = feat[key][0];
      geojson['properties']['named'] = feat[key][1];
      geojson['properties']['frequency'] = feat[key][2];
      geojson["geometry"]["coordinates"] = [coord[1], coord[0]];
      geojson['properties']['email'] = $("#ID").val();

    }
    features.push(geojson)


  }
  for (rkey in Rcoords2) {
    if(rkey == key) {
      geojson['type'] = 'Feature';
      geojson['geometry'] = {};
      geojson['geometry']['type'] = 'Polygon';
      geojson['properties'] = {};
      geojson['properties']['loctype'] = feat[key][0];
      geojson['properties']['named'] = feat[key][1];
      geojson['properties']['frequency'] = feat[key][2];
      var newcoords = [];
      geojson['properties']['email'] = $("#ID").val();
      for (var x= 0; x < Rcoords2[key].length; x++) {
        var xy;
        
        if(x == Rcoords2[key].length) {
          xy = Rcoords2[key][0];
          newcoords.push([xy[1],xy[0]]);
        } else {
          xy = Rcoords2[key][x];
          newcoords.push([xy[1],xy[0]]);
      }
      
     }
     geojson['geometry']['coordinates'] = newcoords
     features.push(geojson)
  }
}
}
  featureClass['type'] = 'FeatureCollection';
  featureClass['features'] = features;
  var json = JSON.stringify(featureClass);
  $("#geocode").val(json);

 


});
