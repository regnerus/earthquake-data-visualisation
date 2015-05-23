function drawBoreholes(dataset, map) {
    // get any existing circles
    var boreholes = map.selectAll("circle").data(dataset)

    var radius = d3.scale.linear()
        .range(range(1, 1))
        .domain([1, 1]);

    boreholes.enter()
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
        .style("fill", "black")
        .style("fill-opacity", 0)
        .transition()
        .delay(function(d, i) {
            return i / dataset.length * 1000;
        })
        .duration(1000)
        .attr("r", function(d) {
            return radius(1);
        })
        .style("fill-opacity", 0.25);

    // remove circles for old earthquakes no longer in data
    boreholes.exit()
        .transition()
        .attr("r", 0)
        .style("fill-opacity", 0)
        .remove();
}