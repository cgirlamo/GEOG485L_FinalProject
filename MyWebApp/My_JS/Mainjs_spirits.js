var beer = '../data/beer.csv';
var beer1 = '../data/beer1.csv'
var wine = '../data/Wine Imports Value.csv';
var spirits = '../MyWebApp/data/Spirit Consumption.csv';
var whiskey = '../data/whiskey.csv'
//set the liquor value
liqour = spirits;




//set the slider and year variable
var slider = document.getElementById('myRange');
var Year = '';
Year = slider.value;

//output the current year of the slider
function output(slider) {
  d3.select('#scontent')
    .append('p')
    .text('The Current Year is: ' + slider)

};
//call the function
output(Year);
//set the height and width
var width = '100%';
var height = '100%';

// these variables will be used to create the pie chart and histogram
var sales = [];
var demand = {};
var countryname = [];

//select the mapid div and create the tooltip
d3.select('#mapid')
  .append('div')
  .attr('id', 'tooltip')
  .attr('style', 'position: absolute; opacity: 0');



//set the map using leaflet
var mymap = L.map('mapid').setView([51.505, -0.09], 2);
//set the background map
var Esri_OceanBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
  maxZoom: 13
}).addTo(mymap);

//append the svg with attribute
var svg = d3.select('#mapid').append('svg').attr('width', width).attr('height', height)
//open our csv
d3.csv(liqour, function (beer) {
  //open our csv
  d3.json('../data/countries.json', function (data) {
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
          //format the cases value so that it can be converted to a numerical format
          cases = cases.split(',').join('');
          //cycle through the geojson
          for (var j = 0; j < jkeys.length; j++) {
            //get the country names
            jcnt = data.features[j].properties['CNTRY_NAME'];
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
            if (data.features[j].properties.cases == false) {
              data.features[j].properties.cases = 0;
            }
          }
        }
      }
    }
    //create a function to draw in the map
    function lmap(response) {


      //add in the underlying geojson
      L.geoJson(response).addTo(mymap);
    };
    //draw in the underlying geojson
    lmap(data);
    //create a function to draw in the chloropleth map
    function chloroplethM(response) {
      //get the chloropleth colors
      function getColor(value) {
        return value > 5000000
          ? '#800026'
          : value > 1000000
            ? '#E31A1C'
            : value > 500000
              ? '#FC4E2A'
              : value > 100000
                ? '#FD8D3c' 
                : '#FFEDA0';
      }
      //assign the colors based on value and country
      function style(feature) {
        var value = feature.properties.cases;
        var coun = feature.properties.CNTRY_NAME;

        //if value and country are present
        if (value && coun) {
          return {
            fillColor: getColor(value),
            fillOpacity: 0.7,
            weight: 0.5,
            color: "black"
          };
        } else {
          return {
            fillColor: '#FFA07A',
            weight: 2,
            fillOpacity: 0,
            weight: 0.5,
            color: 'black'
          };
        }
      }



      //draw the chloropleth and create the tooltips
      L.geoJson(response, { style: style}).bindTooltip(function (layer) {
        if (layer.feature.properties.cases == 'undefined') {
          return '<b>countries:</b> ' + layer.feature.properties.CNTRY_NAME + '<br>' + '<b>cases:</b> 0 <br> <b>Year:<b> ' + Year;
        } else {
          return '<b>countries:</b> ' + layer.feature.properties.CNTRY_NAME + '<br>' + '<b>cases consumed:</b> ' + layer.feature.properties.cases + '<br> <b>Year:</b>' + Year;
        }

      },
        { direction: 'bottom', sticky: 'true' }).addTo(mymap);



    }
    //draw in the map
    chloroplethM(data);

    //get the chloropleth colors(set this function globally instead of just locally)
    function getColor(value) {
      return value > 5000000
        ? '#800026'
        : value > 1000000
          ? '#E31A1C'
          : value > 500000
            ? '#FC4E2A'
            : value > 100000
              ? '#FD8D3c'
              : value > 0
                ? '#ffcc99'
                : '#FFEDA0';
    }
    //create the legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 100000, 500000, 1000000, 5000000]
      labels = [];

      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br> <br>' : '+');
      }

      return div;

    }
    //add the legend to the map
    legend.addTo(mymap);
    var colors = [[0, '#FEB224C'], [100000, '#FD8D3c'], [500000, '#FC4E2A'], [1000000, '#E31A1C'], [5000000, '#800026']]
    //draw on the histogram
    //define the data and settings for the histogram
    var data = [{
      x: countryname,
      type: 'bar',
      y: sales,
      marker: {
        color: '#800026'
      }

    }];
    //draw in the histogram using plotly
    Plotly.newPlot('my_hist', data);

    //draw in the pie chart
    //define the data and settings for the pie chart
    var donut = [{
      values: sales,
      labels: countryname,
      type: 'pie',
      textinfo: 'none',
      hoverinfo: 'label + percent'

    }];
    layout = [{
      margin: {
        padding: 3
      },
      hovermode: 'closest',
      autoexpand: 'true',
      height: 600,
      width: 600
    }];

    //draw in the pie chart using Plotly
    Plotly.newPlot('my_donut', donut, layout, { responsive: true });


    




    //use the slider input to change the year value and reload the map
    slider.oninput = function () {
      Year = this.value
      location.reload()


    };
  })
});
