function BoreholesFunction(data) {
    // get any existing circles
    var holes = boreholes.selectAll("circle").data(data)

    holes.enter()
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
            return i / data.length * 1000;
        })
        .duration(1000)
        .attr("r", function(d) {
            return 2;
        })
        .style("fill-opacity", 0.25);

    // remove circles for old earthquakes no longer in data
    holes.exit()
        .transition()
        .attr("r", 0)
        .style("fill-opacity", 0)
        .remove();
}