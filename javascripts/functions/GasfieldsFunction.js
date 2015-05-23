function drawGasfields(dataset, map) {
    // get any existing circles
    var gasfields = map.selectAll("path").data(dataset)

    var radius = d3.scale.pow()
        .range([2, 12])
        .domain([0, 5]);

    // add new circles for new earthquakes
    
    gasfields.enter()
        .append("path")
        .attr("d", path.projection(xy))

        .style("fill", "black")
        .style("fill-opacity", 0)
        .transition()
        .delay(function(d, i) {
            return i / dataset.length * 1000;
        })
        .duration(1000)
        .style("fill-opacity", .15)

    // remove circles for old earthquakes no longer in data
    gasfields.exit()
        .transition()
        .style("fill-opacity", 0)
        .remove();
}