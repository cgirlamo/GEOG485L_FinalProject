        
var mymap = L.map('mapid').setView([40.91443, -74.17075],12);


var Pcoords = [];
var Rcoords2 = [];
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
mymap.on(L.Draw.Event.CREATED, function(e) {
    //set the layer type
    var type = e.layerType;
    //set the layer value
    var layer = e.layer;
    //add the new layer to drawn items
    drawnItems.addLayer(layer);
    if (type == 'marker') {
        latlngs = layer.getLatLng();
        var values = Object.values(latlngs)
        Pcoords.push(values);
 
    }
    if (type == 'rectangle') {
        var values =[];
       latlngs = layer.getLatLngs();
       console.log(typeof(latlngs[0]))
       var Rcoords = [];
       for (var i = 0; i < 5; i ++) {
           if (i == 4) {
               values = Object.values(latlngs[0][0]);
           } else {
               values = Object.values(latlngs[0][i]); 
           }
           Rcoords.push(values);
       }
       Rcoords2.push(Rcoords)

    }
});
var features = [];
var featureClass = {};
 $('#submit').on('click', function(e) {
    e.preventDefault()

    console.log(Rcoords2.length);
    for (feature in Rcoords2) {
        
        var geojson = {};
        geojson['type'] = 'Feature';
        geojson['geometry'] = {};
        geojson['geometry']['type'] = 'Polygon';
        geojson['properties'] = {};

        var newcoords = [];
        geojson['properties']['ID'] = $("#ID").val();
        for (var x =0; x < Rcoords2[feature].length; x++) {
            var coordinates = Rcoords2[feature][x]
            console.log(coordinates)
            newcoords.push([coordinates[1],coordinates[0]]);
            }
            geojson['geometry']['coordinates'] = [newcoords];
            features.push(geojson);
        }
        console.log(Pcoords);
        for (feature in Pcoords) {
            coord = Pcoords[feature];
            var geojson = {};
            console.log(feature);
            geojson['type'] = 'Feature';
            geojson['geometry'] = {};
            geojson['properties'] = {};
            geojson['geometry']['type'] = 'Point';
            geojson['geometry']['coordinates'] = [coord[1], coord[0]];
            geojson['properties']['ID'] = $('#ID').val()
            
            features.push(geojson);
            
        }
        featureClass['type'] = "FeatureCollection";
        featureClass['features'] = features;
        var json = JSON.stringify(featureClass);
        $('#geocode')
        .val(json);
 });