var beer = '../data/beer.csv';
var beer1 = '../data/beer1.csv'
var wine = '../data/WineImports.csv';
var spirits = '../data/Spirit Consumption.csv';
var whiskey = '../data/whiskey.csv'
//set the liquor value
var liquor;
// //get the document ready, for jquery values
// $(document).ready(function ( ) {
//   //select menu items when they are clicked 
//   $('.menu').click(function() {
//     switch($(this).attr('id')) {
//       case 'standard':
//         liqour = standard;
//         break;
//       case 'premium':
//         liquor = premium;
//         break;
//       case 'ultra_p':
//         liquor = ultra_p
//         break;
//       case 'wine':
//         liquor = wine;
//         break;
//       case 'beer':
//         liquor = beer1;
//         break;
//       case 'spirits':
//         liquor = spirits;
//         break;  
//       default:
//         break;
          




//This is set for now while I'm testing things but will be controlled using the slide tool before
var Year = '1997'




var width = '100%';
var height = '100%';


var sales = [];
var demand = {};
var countryname = [];




//Begin to draw the map!

//set the map using leaflet
var mymap = L.map('mapid').setView([51.505, -0.09], 2);
//set the background map
var Esri_OceanBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
  maxZoom: 13
}).addTo(mymap);
//set the projection for d3
var projection = d3.geoMercator().translate([width / 2, height / 2]).center([0, 40]);
//set the geopath for drawing the geojosn
var path = d3.geoPath().projection(projection);
d3.queue()
  .defer(d3.json,'../data/countries.json')
  .defer(d3.csv,'../countries/beer1.csv')
//append the svg with attribut
var svg = d3.select('#mapid').append('svg').attr('width', width).attr('height', height)
d3.csv(beer1, function (beer) {

  d3.json('data/countries.json', function (data) {
    //get the keys of the object
    var jkeys = Object.keys(data.features)
    //cycle througth beer
    for (i = 0; i < beer.length; i++) {

      //select beer with the correct year (just a placeholder for now a year with mostly positive values)
      if (beer[i]['Country'] == Year) {

        //get the keys of beer
        keys = Object.keys(beer[0])

        //cycle through the keys, excluding the first one 
        for (var key1 = 1; key1 < keys.length; key1++) {

          //set the country name 
          cnt = keys[key1];

          //find the number of cases for that country
          cases = beer[i][cnt];
          cases = cases.split(',').join('');



          //cycle through the geojson
          for (var j = 0; j < jkeys.length; j++) {


            //get the country names
            jcnt = data.features[j].properties['CNTRY_NAME'];
            // console.log(jcnt)

            //check to see what names match up
            if (cnt == jcnt) {


              //for the numbers that it does, create a cases attribute
              data.features[j].properties.cases = cases;


              //push the number of cases to the demand dictionary(this should help when trying to set the pie and histograms)
              demand[cnt] = cases;
              countryname.push(cnt);
              sales.push(cases);
              
              //if the names do not match, set the value to 0
            } 
            if(data.features[j].properties.cases == false) {
              data.features[j].properties.cases = 0;
            }
            
         
          }

        }

      }
    }
    console.log(data.features)
    var colorScale = d3.scaleOrdinal(d3.schemeAccent)
    .domain([Math.min(sales),Math.max(sales)])
    .range(d3.schemeBlues[7]);
 
    function lmap(response) {
      // L.geoJson(response).addTo(mymap);
      


      function getColor(value) {
        return value > 5000000
        ?'#800026'
        :value > 1000000
        ? '#E31A1C'
        : value > 500000
        ? '#FC4E2A'
        :value > 100000
        ? '#FD8D3c'
        : '#FFF';
      }
   
    function style(feature) {
      var value = feature.properties.cases;
      var coun = feature.properties.CNTRY_NAME;
      

      if (value && coun) {
        return {
          fillColor:getColor(value),
          fillOpacity: 0.7,
          weight: 0.5,
          color: "rgba(255,255,255,0.8)"
        };
      } else {
        return{
          fillColor:'#FFA07A',
          weight: 2,
          fillOpacity: 0,
          weight : 0.5,
          color: 'rgba(255,255,255,0.8)'
        };

      };
      
    }
    L.geoJson(response ,{style: style}).addTo(mymap);
  };
lmap(data)
 




//histogram code
// set the dimensions of the graph



var data = [{
  x:countryname,
  type:'bar',
  y:sales
}];

Plotly.newPlot('my_hist',data);

//donut start



var donut = [{
  values:sales,
  labels:countryname,
  type:'pie',
  textinfo: 'label',
  insidetextorientation: 'radial'

}];
layout= [{
  width: 600
}];


Plotly.newPlot('my_donut',donut, layout, {responsive: true});


// }
})
});