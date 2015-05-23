function setBrush(data) {
    // var container = d3.select('#brush'),
    //     width = container.node().offsetWidth,
    //     margin = {top: 0, right: 0, bottom: 0, left: 0},
    //     height = 100;

    var timeExtent = d3.extent(data, function(d) {
        return new Date(d.properties.date);
    });

    var radius = d3.scale.pow()
        .range([2, 12])
        .domain([0, 5]);

    // var svg = container.append('svg')
    //     .attr('width', width + margin.left + margin.right)
    //     .attr('height', height + margin.top + margin.bottom);

    // var context = svg.append('g')
    //     .attr('class', 'context')
    //     .attr('transform', 'translate(' +
    //         margin.left + ',' +
    //         margin.top + ')');

    var x = d3.time.scale()
        .range([0, width])
        .domain(timeExtent);

    var brush = d3.svg.brush()
        .x(x)
        .on('brushend', brushend);

    brushes.selectAll('circle.quake')
        .data(data)
        .enter()
        .append('circle')
        .attr('transform', function(d) {
            return 'translate(' + [x(new Date(d.properties.date)), height / 2] + ')';
        })
        .attr("r", function(d) {
            return radius(d.properties.mag);
        })
        .attr('opacity', 0.5)
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .attr('fill', 'red');

    brushes.append('g')
        .attr('class', 'x brush')
        .call(brush)
        .selectAll('rect')
        .attr('y', -6)
        .attr('height', height);

    function brushend() {
        var filter;
            // If the user has selected no brush area, share everything.
        if (brush.empty()) {
            filter = function() { return true; }
        } 
        else {
            // Otherwise, restrict features to only things in the brush extent.
            filter = function(feature) {
                return new Date(feature.properties.date) > +brush.extent()[0] &&
                    new Date(feature.properties.date) < (+brush.extent()[1]);
            };

            console.log(filter);
        }
        var filtered = data.filter(filter);

        EarthquakesFunction(filtered);
    }
}