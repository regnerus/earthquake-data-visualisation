function drawEarthquakes(dataset, map) {
    // get any existing circles
    var earthquakes = map.selectAll("circle").data(dataset);

    var radius = d3.scale.linear()
        .range(range(1, 10))
        .domain([0, 3]);

    var colourScale = d3.scale.linear()
        .range([0, 1])
        .domain([0, 3]);

    var fillOpacity = d3.scale.linear()
        .range([0, .5])
        .domain([0, 3]);
                    
    var colourInterpolator = d3.interpolateHsl("#C63C09", "#F88180");
                   //colours can be specified as any CSS colour string

    // add new circles for new earthquakes
    
    earthquakes.enter()
        .append("circle")
        .attr("cx", function(d) {
            return xy(d.geometry.coordinates)[0]
        })
        .attr("cy", function(d) {
            return xy(d.geometry.coordinates)[1]
        })
        .attr("r", function(d) {
            return 0;
        })
        .style("fill", function(d) {
            return colourInterpolator(colourScale(Math.abs(d.properties.mag)));
        })
        .style("fill-opacity", 0)
        .transition()
        .delay(function(d, i) {
            return i / dataset.length * 1000;
        })
        .duration(1000)
        .attr("r", function(d) {
            return radius(Math.abs(d.properties.mag));
        })
        .style("fill-opacity", function(d) {
            return fillOpacity(Math.abs(d.properties.mag));
        });

    // remove circles for old earthquakes no longer in data
    earthquakes.exit()
        .transition()
        .attr("r", 0)
        .style("fill-opacity", 0)
        .remove();
}