window.document.onload = function(e){

//Width and height of map
var width = 960;
var height = 500;





L.geoJSON(countries).addTo(map);


// D3 Projection
var projection = d3.geo.albersUsa()
    .translate([width / 2, height / 2])    // translate to center of screen
    .scale([1000]);          // scale things down so see entire US

// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
    .projection(projection);  // tell path generator to use albersUsa projection


// Define linear scale for output
var color = d3.scale.linear()
    .range(["rgb(213,222,217)", "rgb(69,173,168)", "rgb(84,36,55)", "rgb(217,91,67)"]);
//Create SVG element and append map to the SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Append Div for tooltip to SVG
var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// // Load in my Irish Whiskey Sales Data
// d3.csv("Irish Whiskey Sales by Volume.csv", function (data) {
//     color.domain([0, 1, 2, 3]); // setting the range of the input data
//     // Load in my Wine Production Data
//     d3.csv("Wine_Production_by_country.csv", function (data) {
//         color.domain([0, 1, 2, 3]); // setting the range of the input data
//     }
// };

};