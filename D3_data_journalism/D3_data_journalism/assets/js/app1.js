// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 10,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper,append an SVG group that will hold the chart; source website and class exercises https://d3plus.org/examples/d3plus-text/getting-started/ 
var svg = d3("#scatter") //got this from the hairband exercise 
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group, got this example from exercise 16-D3 Activity 3 12-Pair_Hair_Metal_Conclusion and from info on above website 
var chartGroup = svg.append("g")
  .attr("height", height)
  .attr("width", width)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set initial parameters x and y proeprty values
var xPvalue = "poverty";
var yPvalue = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(data, xPvalue) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[xPvalue]) * 0.8, 
    d3.max(data, d => d[xPvalue]) * 1.2 
    ])
    .range([0, width]);

  return xLinearScale;
}

// create this function which will be used for updating x-scale y Property Value var upon click on axis label
function yScale(data, yPvalue) {
  // set up the scales;
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[yPvalue]) * 0.8, 
    d3.max(data, d => d[yPvalue]) * 1.1 
    ])
    .range([height, 0]);

  return yLinearScale;
}

// for updating xAxis var on click on X axis label; source https://www.geeksforgeeks.org/d3-js-axisbottom-function/ 
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom()(newXScale); //i commented this out because it keeps erroring

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// this is for updating xAxis var on click for Y axis label;got this example from exercise 16-D3 Activity 3 12-Pair_Hair_Metal_Conclusion 
function renderyAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(500)
    .call(leftAxis);

  return yAxis;
}
// function used for updating circles group with a transition to
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[xPvalue]))
    .attr("cy", d => newYScale(d[yPvalue]));
  return circlesGroup;
}
//set up function to render text in the circles
function renderText(circleText, newXScale, xPvalue, newYScale, yPvalue) {
  circleText.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[xPvalue]))
    .attr("y", d => newYScale(d[yPvalue]));
  return circleText;
}
// function used for updating circles group with new tooltip
function updateToolTip(xPvalue,yPvalue, circlesGroup) {
  console.log("update tool tip", xPvalue);
  var label;

  // this is used to set up the x and y axis labels for the tool tip when depending on what is selected
  if (xPvalue === "poverty") {
    label = "Poverty:";
  }
  else if (xPvalue === "age") {
    label = "Age:";
  }
  else {
    label = "Household Income:";
  }

  if (yPvalue === "obesity") {
    ylabel = "Obesity:";
  } 
  else if (yPvalue === "smokes") {
      ylabel = "Smokes:";
  }
  else {
    ylabel = "Lack Healthcare:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
        if (xPvalue === "poverty") {
          return (`${d.state}<br>${label} ${d[xPvalue]}%<br>${ylabel} ${d[yPvalue]}%`);
        } 
        else
        return (`${d.state}<br>${label} ${d[xPvalue]}<br>${ylabel} ${d[yPvalue]}%`);
    });
// create a function for x and y tooltip when selected
circlesGroup.call(toolTip);
circlesGroup.on("mouseover", function (data) {
    toolTip.show(data);
})
// action for an onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

    return circlesGroup;
  }


// Retrieve data from the CSV file and execute everything below
  d3.csv("assets/data/data.csv").then(function (data) {
    
// Iterate an array and parse data and cast as numbers; source's https://dmitripavlutin.com/foreach-iterate-array-javascript/
// cast as string source https://stackoverflow.com/questions/49741744/d3-parse-number-from-string
data.forEach(d => {
      d.poverty = + d.poverty;
      d.healthcare = + d.healthcare;
      d.age = + d.age;
      d.income = + d.income;
      d.obese = + d.obese;
      d.smokes = + d.smokes
    });

// xLinearScale function above csv import
  var xLinearScale = xScale(data, xPvalue);


  var yLinearScale = yScale(data, yPvalue);

 // Create bottom(x) and left(y) axis functions
 var bottomAxis = d3.axisBottom(xLinearScale);
 var leftAxis = d3.axisLeft(yLinearScale);

 // append axes to chart
 var xAxis = chartGroup.append("g")
   .attr("transform", `translate(0, ${height})`)
   .call(bottomAxis);
 
 chartGroup.append("g")
   .call(leftAxis); 

 // Create the circles source of code https://stackoverflow.com/questions/18250263/draw-circles-using-d3#18250891
 var circlesGroup = chartGroup.selectAll("circle")
   .data(data)
   .enter()
   .append("circle")
   .attr("cx", d => xLinearScale(d[xPvalue])) 
   .attr("cy", d => yLinearScale(d[yPvalue])) 
   .attr("r", "15") 
   .attr("class", "stateCircle") 
   .attr("opacity", ".7");


 // Create group for two x-axis labels; source https://stackoverflow.com/questions/10893004/d3-transform-scale-and-translate
 var labelsGroup = chartGroup.append("g")
   .attr("transform", `translate(${width / 2}, ${height + 20})`);


 var povertyLabel = labelsGroup.append("text")
   .attr("x", 0)
   .attr("y", 15)
   .attr("value", "poverty")
   .classed("active", true)
   .text("In Poverty %");

 var incomeLabel = labelsGroup.append("text")
   .attr("x", 0)
   .attr("y", 30)
   .attr("value", "income")
   .classed("inactive", true)
   .text("Household Income (Median)");

  var ageLabel = labelsGroup.append("text")
   .attr("x", 0)
   .attr("y", 45)
   .attr("value", "age") 
   .classed("inactive", true)
   .text("Age (Median)");  


 var obesityLabel = labelsGroup.append("text")
   .attr("transform","rotate(-90)")
   .attr("x", (margin.left) * 2.5)
   .attr("y", 0 - (height -60))
   .attr("value", "obesity") 
   .classed("active", true)
   .text("Obesity (%)");

 var smokesLabel = labelsGroup.append("text")
   .attr("transform","rotate(-90)")
   .attr("x", (margin.left) * 2.5)
   .attr("y", 0 - (height -40))
   .attr("value", "smokes") 
   .classed("inactive", true)
   .text("Smokes (%)");

  var healthcareLabel = labelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0 - (height -20))
    .attr("value", "healthcare") 
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");  


 //  add text to Circle
 var circleText = chartGroup.selectAll()
   .data(data)
   .enter()
   .append("text")
   .text(d => d.abbr)
   .attr("x", d => xLinearScale(d[xPvalue])) 
   .attr("y", d => yLinearScale(d[yPvalue])) 
   .attr("class", "stateText") 
   .attr("font-size", "9");


 // updateToolTip function above csv import
 var circlesGroup = updateToolTip(xPvalue, yPvalue,circlesGroup);

 // x axis labels event listener
 labelsGroup.selectAll("text")
   .on("click", function () { 
     // get value of selection
     var value = d3.select(this).attr("value");

    if(true){   
     if (value == "poverty" || value=="income" || value=="age") { 
       console.log(value)
       // replaces xPvalue with value
       xPvalue = value;
     
       xLinearScale = xScale(data, xPvalue);

       // updates x axis with transition
       xAxis = renderXAxis(xLinearScale, xAxis);

            
       // changes classes to change bold text
       if (xPvalue === "income") {
         incomeLabel
           .classed("active", true)
           .classed("inactive", false);
         povertyLabel
           .classed("active", false)
           .classed("inactive", true);
         ageLabel
           .classed("active", false)
           .classed("inactive", true); 
       }
       else if(xPvalue == "age"){
         ageLabel
         .classed("active", true)
         .classed("inactive", false);  
         povertyLabel
         .classed("active", false)
         .classed("inactive", true);
         incomeLabel
         .classed("active", false)
         .classed("inactive", true);
       }
       else {
         povertyLabel
           .classed("active", true)
           .classed("inactive", false);
         incomeLabel
           .classed("active", false)
           .classed("inactive", true);
         ageLabel
           .classed("active", false)
           .classed("inactive", true); 
      }

     } 
     else
           
       // replaces hProperty with value
       yPvalue = value;
       yLinearScale = yScale(data, yPvalue);
      
             
       // changes classes to change bold text
       if (yPvalue === "obesity") {
         obesityLabel
           .classed("active", true)
           .classed("inactive", false);
         healthcareLabel
           .classed("active", false)
           .classed("inactive", true);
         smokesLabel
           .classed("active", false)
           .classed("inactive", true); 
       }
       else if(yPvalue == "healthcare"){
         healthcareLabel
         .classed("active", true)
         .classed("inactive", false);  
         obesityLabel
         .classed("active", false)
         .classed("inactive", true);
         smokesLabel
         .classed("active", false)
         .classed("inactive", true);

       }
       else {
         smokesLabel
           .classed("active", true)
           .classed("inactive", false);
         healthcareLabel
           .classed("active", false)
           .classed("inactive", true);
         obesityLabel
           .classed("active", false)
           .classed("inactive", true); 
      }
   
      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, xPvalue, yLinearScale, yPvalue);
     //  update circle text
      circleText = renderText(circleText, xLinearScale, xPvalue, yLinearScale, yPvalue); 

      // updates tooltips with new info
      circlesGroup = updateToolTip(xPvalue, yPvalue, circlesGroup);

   } 
 
 }); 

}).catch(function (error) {
 console.log(error);
});