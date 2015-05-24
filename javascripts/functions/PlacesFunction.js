function drawPlaces(dataset, map) {

    // get any existing circles
    var places = map.selectAll("circle").data(dataset)
    
    var radius = d3.scale.sqrt()
        .range(range(2, 10))
        .domain([1000, 800000]);

    var colourScale = d3.scale.sqrt()
        .range([0, 1])
        .domain([1000, 800000]);

    var fillOpacity = d3.scale.sqrt()
        .range([.50, .75])
        .domain([1000, 800000]);
                    
    var colourInterpolator = d3.interpolateHsl("#49BCEF", "#1E6787");
                   //colours can be specified as any CSS colour string

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
        .on("mouseover", function(d) {   
            tooltip_earthquake = d3.select(".tooltip--earthquake").style("opacity", 0);
               
            tooltip_place.transition()
                .duration(500)  
                .style("opacity", 0);
            tooltip_place.transition()
                .duration(200)  
                .style("opacity", .9);  
            tooltip_place.html(d.properties.name)
                .style("left", (d3.event.pageX) + "px")          
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .style("fill", function(d) {
            return colourInterpolator(colourScale(Math.abs(d.properties.population)));
        })
        .style("fill-opacity", 0)
        .transition()
        .delay(function(d, i) {
            return i / dataset.length * 200;
        })
        .duration(1000)
        .attr("r", function(d) {
            return radius(Math.abs(d.properties.population));
        })
        .style("fill-opacity", function(d) {
            return fillOpacity(Math.abs(d.properties.population));
        })
        .attr("data-tooltip", function(d) { 
            return d.properties.name; 
        });

    // remove circles for old earthquakes no longer in data
    places.exit()
        .transition()
        .attr("r", 0)
        .style("fill-opacity", 0)
        .remove();
}