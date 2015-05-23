var Legend = function(el, series) {
  this.el = d3.select(el);
  this.series = series;
};

Legend.prototype.update = function(series, animate) {
  this.series = series;
  
  var item = this.el
    .selectAll(".shart-legend-item")
      .data(series);
  
  var exit = item.exit();
  
  var enter = item.enter()
    .append("div")
      .classed("shart-legend-item", true);
  
  var swatch = enter.append("span")
    .classed("shart-swatch shart-legend-item-swatch", true)
    .style("background-color", function(d) { return d.color })
    .style("border-radius", function(d) { 
      if(d.rounded) {
        return '50%';
      }
      else {
        return '0'; 
      }
      
    });

  var label = enter.append("span")
    .classed("shart-legend-item-label", true)
    .text(function(d) { return d.label });
  
  if (animate) {
    exit
      .transition()
        .style('opacity', 0)
        .remove();
    
    enter
      .style('opacity', 0)
      .transition()
        .duration(1000)
        .style('opacity', 1);
    
  } else {
    exit
      .remove();
  }

};

Legend.prototype.draw = function() {
  this.el
    .classed("shart-legend", true);

  this.update(this.series);
}