
var barData;
var vis;

function countMagnitude(json, key, low, high) {
    var count = 0;

    for(var i= 0; i < json.length; i++) {
        if(Number(json[i].properties[key]) >= low && Number(json[i].properties[key]) < high) {
            count++;
        }
    }

    return count;
}

function updateBarChart(data) {
    var first = countMagnitude(data, 'mag', 0, 1);
    var second = countMagnitude(data, 'mag', 1, 2);
    var third = countMagnitude(data, 'mag', 2, 3);
    var fourth = countMagnitude(data, 'mag', 3, 4);

    barData = [{
        x : '0-1',
        y : first
    }, {
        x : '1-2',
        y : second
    }, {
        x : '2-3',
        y : third
    }, {
        x : '3-4',
        y : fourth
    }];

    vis.select(".y").remove();

        xRange = d3.scale.ordinal().rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], 0.1).domain(barData.map(function (d) {
            return d.x;
        })),


        yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,
            d3.max(barData, function (d) {
                return d.y;
            })
        ]),

        xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(5)
            .tickSubdivide(true),

        yAxis = d3.svg.axis()
            .scale(yRange)
            .tickSize(5)
            .orient("left")
            .tickSubdivide(true);

    vis.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
        .call(xAxis);

    vis.append('svg:g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
        .call(yAxis);

    var bar = vis.selectAll("rect")
        .data(barData, function(d) { return d.x; });

    bar.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xRange(d.x); })
        .attr("y", function(d) { return yRange(d.y); })
        .attr("height", function(d) { return ((HEIGHT - MARGINS.bottom) - yRange(d.y)); })
        .attr("width",xRange.rangeBand());
// removed data:
    bar.exit().remove();
// updated data:
    bar
        .attr("y", function(d) { return  yRange(d.y); })
        .attr("height", function(d) { return ((HEIGHT - MARGINS.bottom) - yRange(d.y)); });
}

function drawBarChart(data) {

    var first = countMagnitude(data, 'mag', 0, 1);
    var second = countMagnitude(data, 'mag', 1, 2);
    var third = countMagnitude(data, 'mag', 2, 3);
    var fourth = countMagnitude(data, 'mag', 3, 4);

    barData = [{
        p : 1,
        x : '0-1',
        y : first
    }, {
        p : 2,
        x : '1-2',
        y : second
    }, {
        p : 3,
        x : '2-3',
        y : third
    }, {
        p : 4,
        x : '3-4',
        y : fourth
    }];

    vis = d3.select('#barchart'),
        WIDTH = 400,
        HEIGHT = 200,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        },
        xRange = d3.scale.ordinal().rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], 0.1).domain(barData.map(function (d) {
            return d.x;
        })),


        yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,
            d3.max(barData, function (d) {
                return d.y;
            })
        ]),

        xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(5)
            .tickSubdivide(true),

        yAxis = d3.svg.axis()
            .scale(yRange)
            .tickSize(5)
            .orient("left")
            .tickSubdivide(true);


    vis.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
        .call(xAxis);

    vis.append('svg:g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
        .call(yAxis);

    vis.selectAll('rect')
        .data(barData)
        .enter()
        .append('rect')
        .attr('x', function (d) {
            return xRange(d.x);
        })
        .attr('y', function (d) {
            return yRange(d.y);
        })
        .attr('width', xRange.rangeBand())
        .attr('height', function (d) {
            return ((HEIGHT - MARGINS.bottom) - yRange(d.y));
        })
        .attr('fill', 'grey')
        .on('mouseover',function(d){
            if(clickedBar != this) {
                d3.select(this)
                    .attr('fill','orange');
            }
        })
        .on('mouseout',function(d){
            if(clickedBar != this) {
                d3.select(this)
                    .attr('fill','grey');
            }
        });
}