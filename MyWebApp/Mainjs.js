
var width = '100%';
var height = '100%';

		// Define linear scale for output
		var color = d3.scaleOrdinal()
			.range(["rgb(213,222,217)", "rgb(69,173,168)", "rgb(84,36,55)", "rgb(217,91,67)"]);

var countries = d3.json('countries.json')
var mymap = L.map('mapid').setView([51.505, -0.09], 2);


var Esri_OceanBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
  maxZoom: 13
}).addTo(mymap);


var projection = d3.geoMercator().translate([width / 2, height / 2]).center([0, 40]);

var path = d3.geoPath().projection(projection);

var svg = d3.select('#mapid').append('svg').attr('width', width).attr('height', height)
d3.csv('beer1.csv', function (beer) {
  d3.json('countries.json', function (data) {
    //get the keys of the object

    var jkeys = Object.keys(data.features)
    

    //cycle througth beer
    for (i = 0; i < beer.length; i++) {
      

      //select beer with the correct year (just a placeholder for now a year with mostly positive values)
      if (beer[i]['Country'] == '1997') {
        keys =Object.keys(beer[i])
        for (var key = 1;key < keys.length; key ++) {
          cnt = keys[key];
          cases = beer[i][cnt]
          for (var j = 0; j < jkeys.length; j++) {
            jcnt = data.features[j].properties['CNTRY_NAME'];
            
            if (cnt == jcnt) {
              
               data.features[j].properties['cases'] = cases;
              console.log(data.features[j].properties.cases);
            }
          }


        }







      }
    }




    var leaflet_paths = mymap.addLayer(new L.GeoJSON(data));
    svg.selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('class', 'countries')
      .attr('d', leaflet_paths)
      .style('fill', function (d) {

        var value = d.properties.cases;

        if (value) {
          //if value exists..
          return color(value)
        } else{
          //if value is undefined
          return 'rgb(213,222,217)';
        }

      });
  })
});


//donut chart code 
var width = 400;
var height = 350;
margin = 40;

//set the margin to half of whatever is smaller, width or height  
var radius = Math.min(width, height) / 2 - margin;

//append the svg object to the div called 'my_donut')
var svg = d3.select('#my_donut')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

//create a data set(for example version only)
var data1 = { a: 9, b: 20, c: 30, d: 14, e: 12 }
var data2 = { a: 6, b: 16, c: 20, d: 14, e: 19, f: 12 }

//set the color scale
var color = d3.scaleOrdinal()
  .domain(['a', 'b', 'c', 'd', 'e', 'f'])
  .range(d3.schemeDark2);

//a function to create/update plot for a given variable
function update(data) {
  //compute the position of each group on the pie:
  var pie = d3.pie()
    .value(function (d) { return d.value; })
    .sort(function (a, b) { console.log(a); return d3.ascending(a.key, b.key); })
  var data_ready = pie(d3.entries(data))

  //mapr the data
  var u = svg.selectAll('path')
    .data(data_ready);
  u.enter()
    .append('path')
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function (d) { return (color(d.data.key)) })
    .attr('stroke', 'white')
    .style('stroke-width', '2px')
    .style('opacity', 1)


  //remove the group that is not present anymore
  u.exit()
    .remove()

}
//iniatilize the plot with the first dataset
update(data1)



//histogram code
// set the dimensions of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 40 };
var width = 400 - margin.left - margin.right;
var height = 350 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select('#my_hist')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform',
    'translate(' + margin.left + ',' + margin.top + ')');
//get the data
d3.csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv', function (hist) {
  //X axis: scale and draw:
  var x = d3.scaleLinear()
    .domain([0, 1000])
    .range([0, width])
  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  //set the parameters for the histogram
  var histogram = d3.histogram()
    .value(function (d) { return d.price; })
    .domain(x.domain())
    .thresholds(x.ticks(70));

  //apple this function to data to get the bins
  var bins = histogram(hist);

  //Y axis: scale and draw:
  var y = d3.scaleLinear()
    .range([height, 0])
  y.domain([0, d3.max(bins, function (d) { return d.length; })]);
  svg.append('g')
    .call(d3.axisLeft(y));

  //append the bar rectangles to the svg element
  svg.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", 1)
    .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
    .attr("height", function (d) { return height - y(d.length); })
    .style("fill", "#69b3a2")
});
