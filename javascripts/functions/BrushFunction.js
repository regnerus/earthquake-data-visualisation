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

    var y = d3.scale.linear()
        .domain([-3, 3])
        .range([0, height]);

    var brush = d3.svg.brush()
        .x(x)
        .on('brushend', brushend);

    svg.append("rect")
        .attr("class", "grid-background")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(
            d3.svg.axis()
            .scale(x)
            .ticks(40)
            .tickSize(-height)
        )
        .selectAll(".tick")
        .data(
            x.ticks(20), function(d) { 
                return d; 
            }
        )
        .exit()
        .classed("minor", true);

    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0, 0)")
        .call(
            d3.svg.axis()
            .scale(y)
            .ticks(5)
            .orient("left")
            .tickSize(-width)
        )
        .selectAll(".tick")
        .data(
            y.ticks(5), function(d) { 
                return d; 
            }
        )
        .exit()
        .classed("minor", true);

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0, -5)")
        .call(
            d3.svg.axis()
            .scale(x)
            .ticks(10)
        );

    svg.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(20,0)")
        .call(
            d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(5)
        );

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
        .attr('height', height);

    function brushend() {
        // var xRange = d3.time.scale()
        // .range([0, width])
        // .domain(brush.extent);
        if (!d3.event.sourceEvent) return; // only transition after input
        var extent0 = brush.extent(),
        extent1 = extent0.map(d3.time.year.round);

        // if empty when rounded, use floor & ceil instead
        if (extent1[0] >= extent1[1]) {
            extent1[0] = d3.time.year.floor(extent0[0]);
            extent1[1] = d3.time.year.ceil(extent0[1]);
        }

        d3.select(this).transition()
        .call(brush.extent(extent1))
        .call(brush.event);

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