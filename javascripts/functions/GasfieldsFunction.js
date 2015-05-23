function GasfieldsFunction(data) {
    // get any existing circles
    var fields = gasfields.selectAll("path").data(data)

    var radius = d3.scale.pow()
        .range([2, 12])
        .domain([0, 5]);

    // add new circles for new earthquakes
    
    fields.enter()
        .append("path")
        .attr("d", path.projection(xy))

        .style("fill", "black")
        .style("fill-opacity", .25)
        // .transition()
        // .delay(function(d, i) {
        //     return i / data.features.length * 1000;
        // })
        // .duration(1000)
        // .attr("r", function(d) {
        //     return radius(d.properties.mag);
        // })
        // .style("fill-opacity", 0.25);

    // // remove circles for old earthquakes no longer in data
    // quakes.exit()
    //     .transition()
    //     .attr("r", 0)
    //     .style("fill-opacity", 0)
    //     .remove();
}