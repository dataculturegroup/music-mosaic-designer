
$(function(){
  $("#makeMosaic").click(function(evt){
    evt.preventDefault();
    // disable UI
    $( "#makeMosaic input" ).prop( "disabled", true );
    $( "#makeMosaic button" ).prop( "disabled", true );
    $( "#mosaic").html("Loading...");
    // submit request
    $.ajax({
      url:'/analyze',
      data: { 'song': $('#file').val(), 'slices': $('#slices').val() },
      type: "POST",
      // print out JSON results nicely
      success: function( content ) {
        // $('#mosaic').html(JSON.stringify(content,null,"  "));
        $( "#mosaic").html("");
        draw(content);
      },
      // print out error nicely
      error: function( xhr, status, errorThrown ) {
        $('#mosaic').html(status+": "+errorThrown);
      },
      // update UI
      complete: function( xhr, status ) {
        $( "#makeMosaic input" ).prop( "disabled", false );
        $( "#makeMosaic button" ).prop( "disabled", false );
      }
    });
    return false;
  });
});

function draw(data) {
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      innerRadius = 180,
      outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

  // append the svg object to the body of the page
  var svg = d3.select("#mosaic")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")"); // Add 100 on Y translation, cause upper bars are longer

  // X scale
  var x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing ?
      .domain( data.map(function(d) { return d.index; }) ); // The domain of the X axis is the index of the slice

  // Y scale
  var y = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, d3.max(data.map(function(d) { return d.normalized_dBFS; }))]); // Domain of Y is from 0 to the max seen in the data

  // Add bars
  svg.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
      .attr("fill", "#69b3a2")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function(d) { return y(d.normalized_dBFS); })
          .startAngle(function(d) { return x(d.index); })
          .endAngle(function(d) { return x(d.index) + x.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius))
}
