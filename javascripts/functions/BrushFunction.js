function setBrush(dataset, svg) {
    var timeExtent = d3.extent(dataset, function(d) {
        return new Date(d.properties.date);
    });

    var height = 100;

    var radius = d3.scale.linear()
        .range(range(1, 20))
        .domain([0, 3]);

    var colourScale = d3.scale.linear()
        .range([0, 1])
        .domain([0, 3]);

    var fillOpacity = d3.scale.linear()
        .range([0, .5])
        .domain([0, 3]);

    var colourInterpolator = d3.interpolateHsl("#C63C09", "#F88180");
                   //colours can be specified as any CSS colour string

    var x = d3.time.scale()
        .range([0, width])
        .domain(timeExtent);

    var brush = d3.svg.brush()
        .x(x)
        .on('brushend', brushend);


    svg.selectAll('circle.quake')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('transform', function(d) {
            return 'translate(' + [x(new Date(d.properties.date)), height / 2] + ')';
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

    svg.append('g')
        .attr('class', 'x brush')
        .call(brush)
        .selectAll('rect')
        .attr('y', -6)
        .attr('height', height);

    function brushend() {
        var filterEarthquakes, filterGasfield, filterBoreholes;
            // If the user has selected no brush area, share everything.
        if (brush.empty()) {
            filterEarthquakes = function() { return true; }

            filterGasfield = function() { return true; }

            filterBoreholes = function() { return true; }
        } 
        else {
            // Otherwise, restrict features to only things in the brush extent.
            filterEarthquakes = function(feature) {
                return new Date(feature.properties.date) > +brush.extent()[0] &&
                    new Date(feature.properties.date) < (+brush.extent()[1]);
            };

            filterGasfield = function(feature) {
                return new Date(feature.properties.production) > +brush.extent()[1];
            };

            filterBoreholes = function(feature) {
                return new Date(feature.properties.start_date) >= +brush.extent()[0];
            };
        }

        data.earthquakes = dataset.filter(filterEarthquakes);
        // data.gasfields = data.gasfields.filter(filterGasfield);
        // data.boreholes = data.boreholes.filter(filterBoreholes);

        drawEarthquakes(data.earthquakes, map.earthquakes);
    }
}