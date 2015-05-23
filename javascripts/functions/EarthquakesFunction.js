function EarthquakesFunction(data) {
    // get any existing circles
    var quakes = earthquakes.selectAll("circle").data(data)

    var radius = d3.scale.pow()
        .range([2, 12])
        .domain([0, 5]);

    // add new circles for new earthquakes
    
    quakes.enter()
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

        .style("fill", "red")
        .style("fill-opacity", 0)
        .style("stroke", "red")
        .style("stroke-width", "0.5px")
        .style("stroke-opacity", 1)
        .transition()
        .delay(function(d, i) {
            return i / data.length * 1000;
        })
        .duration(1000)
        .attr("r", function(d) {
            return radius(d.properties.mag);
        })
        .style("fill-opacity", 0.25);

    // remove circles for old earthquakes no longer in data
    quakes.exit()
        .transition()
        .attr("r", 0)
        .style("fill-opacity", 0)
        .remove();
}