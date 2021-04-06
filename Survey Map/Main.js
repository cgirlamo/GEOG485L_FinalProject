



// Create the map
var mymap = L.map('mapid').setView([35.105366, -106.629531],12);


//add in the basemap
var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
}).addTo(mymap);


//create the feature group to be drawn and add the mto the map
var drawnItems = new L.FeatureGroup();
mymap.addLayer(drawnItems);
//create a control variable
var drawControl = new L.Control.Draw({
    //set the drawing settings, we are not drawing polylines, polygons, or circles
    draw: {
        polyline: false,
        polygon: false,
        circle: false
    },
    //set the featuregroup to be edited as drawnitems and set it to be editables
    edit: {
        edit: true,
        featureGroup: drawnItems
    
    }
});
//add teh control to the map
mymap.addControl(drawControl);
// when a feature is created,perform these functions
mymap.on(L.Draw.Event.CREATED, function(e) {
    //set the type of the layer
    var type = e.layerType;
    console.log(type)
    //set the layer variable
    var layer = e.layer;
    //if there is already a feature in drawnitedms, delete it
    if(drawnItems && drawnItems.getLayers().length!==0){
        drawnItems.clearLayers();
    }
    //add the new layer to drawnitems
    drawnItems.addLayer(layer);
    //create an empty list for the coordinates
    var coordinates = [];
    //if the feature is a rectangle
    if(type == 'rectangle'){            
    //get the coordinates
        latlngs = layer.getLatLngs();
        //push those coordinates into the coordinates list
        for (var i = 0; i < latlngs.length; i++) {
        coordinates.push([latlngs[i]])
    }
    }
    //if the type is a marker
    if(type == 'marker') {
        //get the coordinates
        latlngs = layer.getLatLng();
        //push them into the coordinates list
        coordinates.push([latlngs])
    }
    //create a popup with a submit button to be created with the marker
    var popupContent = '<form id = "form1">' +
    '<div class = "form-group"'+
    '<div style = "text-align:center;" class = "col-xs-4"><button type = "submit" id = "button1" value = "submit" class = "btn btn-primary">Submit</button></div>'+
    '</div>'+
    '</form>'
    //add the popup
    layer.bindPopup(popupContent, {
        keepinView: true,
        closeButton: false,
    }).openPopup();
    //when the submit button is pressed
    $('#button1').on('submit' ,function(f) {
        //prevent it from automatically submitting
        f.preventDefault()
        //create the geojson variable
        var geojson = {};
        //if the type is rectangle
        if (type == 'rectangle') {
            console.log('success')
            //create each aspect of the geojson
            geojson['type'] = 'Feature';
            geojson['geometry'] = {};
            geojson['geometry']['type'] = 'Polygon';


            geojson['geometry']['coordinates'] = [coordinates];

        }
        //if the type is a marker
        if(type == 'marker') {
            //create each aspect of the geojson
            geojson['type'] = 'Feature';
            geojson['geometry'] = {};
            geojson['geometry']['type'] = 'Point';
            geojson['geometry']['coordinates'] = [coordinates];
        }
        var json = JSON.stringify(geojson);
        console.log(json)
    });

});





