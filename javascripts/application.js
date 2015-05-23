var width               = window.screen.width;
var height              = window.screen.height;    

var xy                  = d3.geo.mercator()
                            .scale(8000)
                            .translate([width/2, height/2])
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

var main, map, data;

function init() {

    var zoom                = d3.behavior.zoom()
                                .scaleExtent([1, 8])
                                .on("zoom", move);

        main                = d3.select('#map').append('svg')
                                .call(zoom)
                                .append("g");

        map                 = {
                                'gasfields'     : main.append("g").attr("id", "gasfields"),
                                'places'        : main.append("g").attr("id", "places"),
                                'boreholes'     : main.append("g").attr("id", "boreholes"),
                                'earthquakes'   : main.append("g").attr("id", "earthquakes"),
                            }

    var brush               = d3.select('#brush').append('svg')
                                .attr('width', width)
                                .attr('height', 100)
                                .append('g');

    setBrush(data.earthquakes, brush);

    draw();
}

function draw() {
    prevScale = scale;
    for(var name in map) {
        main.select('#' + name).selectAll("*").remove();
    }

    drawEarthquakes(data.earthquakes, map.earthquakes);

    drawPlaces(data.places.filter(function(d) {
        return d.properties.population > 500;
    }), map.places);

    drawGasfields(data.gasfields, map.gasfields);

    drawBoreholes(data.boreholes, map.boreholes);
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
    main.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    scale = scaleFunc(d3.event.scale);

    if(prevScale !== scale) {
        console.log(scale);
        throttle();
    }  
}
