var width               = window.screen.width;
var height              = window.screen.height;    

var xy                  = d3.geo.mercator()
                            .scale(8000)
                            // .translate([width/2, height/2])
                            .translate([width/1.5, height/1.6])
                            .center([5.8,52]);

var scale               = 1;
var prevScale           = 1;
var scaleFunc           = d3.scale.linear()
                            .range([1, .5])
                            .domain([1, 8]);

function range(min, max) {
    return [Math.round(min * scale), Math.round(max * scale)];
}

var path                = d3.geo.path();

var tooltip_place = d3.select("body")
    .append("div")
        .attr("class", "tooltip tooltip--place")
        .style("opacity", 0);

var tooltip_earthquake = d3.select("body")
    .append("div")
        .attr("class", "tooltip tooltip--earthquake")
        .style("opacity", 0);

var main, map, data, brush;

function init() {

    var zoom                = d3.behavior.zoom()
                                .scaleExtent([1, 8])
                                .on("zoom", move);

        main                = d3.select('#map').append('svg')
                                .on("click", function(d) {
                                    tooltip_place = d3.select(".tooltip--place").style("opacity", 0);
                                    tooltip_earthquake = d3.select(".tooltip--earthquake").style("opacity", 0);
                                })
                                .call(zoom)
                                .append("g");

        map                 = {
                                'gasfields'     : main.append("g").attr("id", "gasfields"),
                                'places'        : main.append("g").attr("id", "places"),
                                'boreholes'     : main.append("g").attr("id", "boreholes"),
                                'earthquakes'   : main.append("g").attr("id", "earthquakes"),
                            }

        brush               = d3.select('#brush').append('svg')
                                .attr('height', 100)
                                .append('g');

    setBrush(data.earthquakes, brush, data.gasfields, data.boreholes);

    var legend = new Legend('#legend', [
      {color: "rgba(198, 60, 9, .50)", label: "Earthquakes", rounded: true},
      {color: "rgba(73, 188, 239, .50)", label: "Cities", rounded: true},
      {color: "rgba(0, 0, 0, .75)", label: "Boreholes", rounded: true},
      {color: "rgba(0, 0, 0, .25)", label: "Gasfields", rounded: false}
    ]);

    legend.draw();

    draw();
}

window.onresize = function(event) {
    draw();
    setBrush(data.earthquakes, brush);
};

function draw() {
    prevScale = scale;
    for(var name in map) {
        main.select('#' + name).selectAll("*").remove();
    }

    drawBarChart(data.earthquakes);

    drawEarthquakes(data.earthquakes, map.earthquakes);

    drawPlaces(data.places.filter(function(d) {
        return d.properties.population > 1000;
    }), map.places);

    drawGasfields(data.gasfields, map.gasfields);

    drawBoreholes(data.boreholes.filter(function(d) {
        return new Date(d.properties.end_date) > new Date('1986-01-01T00:00:00Z');
    }), map.boreholes);
}

queue()
    .defer(request, "./datasets/earthquakes.geojson")
    .defer(request, "./datasets/places.geojson")
    .defer(request, "./datasets/gasfields.geojson")
    .defer(request, "./datasets/boreholes.geojson")
    .await(function(error, earthquakes, places, gasfields, boreholes) { 
        data = {
            'earthquakes': earthquakes,
            'places': places,
            'gasfields': gasfields,
            'boreholes': boreholes,
        }

        init(data);
    });

function request(url, callback) {
    d3.json(url, function(err, data) {
        if(!err) {
            callback(null, data.features);
        }
        else {
            callback(err);
        }
    });
}

var throttleTimer;
function throttle() {
  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
        draw();
    }, 100);
}

function move() {
    tooltip_place = d3.select(".tooltip--place").style("opacity", 0);
    tooltip_earthquake = d3.select(".tooltip--earthquake").style("opacity", 0);

    main.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    scale = scaleFunc(d3.event.scale);

    if(prevScale !== scale) {
        console.log(scale);
        throttle();
    }  
}
