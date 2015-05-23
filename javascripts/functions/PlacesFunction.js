function PlacesFunction(data) {
    // get any existing circles
    var places = locations.selectAll("circle").data(data)

    var radius = d3.scale.linear()
        .range([2, 20])
        .domain([0, 1000000]);

    var fillOpacity = d3.scale.linear()
        .range([0, 1])
        .domain([0, 5000]);

    places.enter()
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
        .style("fill", "blue")
        .style("fill-opacity", 0)
        // .style("stroke", "blue")
        // .style("stroke-width", "0.5px")
        // .style("stroke-opacity", 1)
        .transition()
        .delay(function(d, i) {
            return i / data.length * 1000;
        })
        .duration(1000)
        .attr("r", function(d) {
            return radius(d.properties.population);
        })
        .style("fill-opacity", function(d) {
            return fillOpacity(d.properties.population);
        });

    // remove circles for old earthquakes no longer in data
    places.exit()
        .transition()
        .attr("r", 0)
        .style("fill-opacity", 0)
        .remove();
}