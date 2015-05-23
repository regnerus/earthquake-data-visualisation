var width               = window.screen.width;
var height              = window.screen.height;

// var svg             = d3.select("body")
//                         .append("svg");

var mapContainer        = d3.select('#map'),
                            width   = width,
                            margin  = {top: 0, right: 0, bottom: 0, left: 0},
                            height   = height - 100;

var mapSvg              = mapContainer.append('svg')
                            .attr('width', width + margin.left + margin.right)
                            .attr('height', height + margin.top + margin.bottom);
                            // .call(d3.behavior.zoom()
                            // .on("zoom", redraw));

var xy                  = mapSvg.projection = d3.geo.mercator()
                            .scale(8000)
                            .translate([width/2, height/2])
                            .center([5.8,52]);

var map                 = mapSvg.append("g").attr("id", "map");
var gasfields           = mapSvg.append("g").attr("id", "gasfields");
var locations           = mapSvg.append("g").attr("id", "places");
var boreholes           = mapSvg.append("g").attr("id", "places");
var earthquakes         = mapSvg.append("g").attr("id", "earthquakes");





var brushContainer      = d3.select('#brush'),
                            width = width,
                            margin = {top: 0, right: 0, bottom: 0, left: 0},
                            height = 100;

var brushSvg            = brushContainer.append('svg')
                            .attr('width', width + margin.left + margin.right)
                            .attr('height', height + margin.top + margin.bottom);

var brushes             = brushSvg.append('g')
                            .attr('class', 'context')
                            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var path                = d3.geo.path();

d3.json('earthquakes.geojson', function(err, data) {
    EarthquakesFunction(data.features);
    setBrush(data.features);
});

d3.json('places.geojson', function(err, data) {
    PlacesFunction(data.features);
});

d3.json('gasfields.geojson', function(err, data) {
    GasfieldsFunction(data.features);
});

d3.json('boreholes.geojson', function(err, data) {
    BoreholesFunction(data.features);
});

function redraw() {
    mapSvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}