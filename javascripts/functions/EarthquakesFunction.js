function drawEarthquakes(dataset, map) {
    // get any existing circles
    var earthquakes = map.selectAll("circle").data(dataset);

    var radius = d3.scale.linear()
        .range(range(0, 10))
        .domain([0, 5]);

    var colourScale = d3.scale.sqrt()
        .range([0, 1])
        .domain([0, 5]);

    var fillOpacity = d3.scale.sqrt()
        .range([0, .2])
        .domain([0, 5]);
                    
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
        .on("mouseover", function(d) {
            tooltip_place = d3.select(".tooltip--place").style("opacity", 0);
              
            tooltip_earthquake.transition()
                .duration(500)  
                .style("opacity", 0);
            tooltip_earthquake.transition()
                .duration(200)  
                .style("opacity", .9);  
            tooltip_earthquake.html(d.properties.location + " <span class=\"magnitude\">" + d.properties.mag + "</span> <span class=\"date\">" + new Date(d.properties.date).toDateString()+ "</span>")
                .style("left", (d3.event.pageX) + "px")          
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .style("fill", function(d) {
            return colourInterpolator(colourScale(Math.abs(d.properties.mag)));
        })
        .style("fill-opacity", 0)
        .transition()
        .delay(function(d, i) {
            return i / dataset.length * 2000;
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