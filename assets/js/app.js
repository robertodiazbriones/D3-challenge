//     // @TODO: YOUR CODE HERE!
// d3.select(window).on("resize", makeResponsive);

// // When the browser loads, makeResponsive() is called.
// makeResponsive();

// // The code for the chart is wrapped inside a function that
// // automatically resizes the chart
// function makeResponsive() {

    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Initial Params
    //X:Poverty
    //  Age
    //  Income
    //Y:Healthcare
    //  Obesity
    //  Smokers

    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";

    // function used for updating x-scale var upon click on axis label
    function xScale(healthData, chosenXAxis) {
        // create scales
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
            d3.max(healthData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    
        return xLinearScale;
    }

    // function used for updating y-scale var upon click on axis label
    function yScale(healthData, chosenYAxis) {
        // create scales
        var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis]) * 1.0,
            d3.max(healthData, d => d[chosenYAxis]) * 1.0
        ])
        .range([height, 0]);
    
        return yLinearScale;
    }

    // function used for updating xAxis var upon click on axis label
    function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
    
        xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
        return xAxis;
    }

    // function used for updating yAxis var upon click on axis label
    function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);
    
        yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
        return yAxis;
    }

    // function used for updating circles group with a transition to
    // new circles
    function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

        circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    
        return circlesGroup;
    }

    // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
        // Initial Params
        //X:Poverty
        //  Age
        //  Income
        //Y:Healthcare
        //  Obesity
        //  Smokers

        var Xlabel, Ylabel;
    
        if (chosenXAxis === "poverty") {
        Xlabel = "Poverty:";
        }
        else if (chosenXAxis === "age") {
            Xlabel = "Age:";
        }
        else if (chosenXAxis === "income") {
            Xlabel = "income:";
        }
        else {
        Xlabel = "X Error:";
        }

        if (chosenYAxis === "healthcare") {
            Ylabel = "Healthcare:";
        }
        else if (chosenYAxis === "obesity") {
            Ylabel = "Obesity:";
            }
        else if (chosenYAxis === "smokes") {
            Ylabel = "Smokers:";
        }
        else {
            Ylabel = "Y Error:";
        }
    
        var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${Xlabel} ${d[chosenXAxis]}<br>${Ylabel} ${d[chosenYAxis]}`);
        });
    
        circlesGroup.call(toolTip);
    
        circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    
    return circlesGroup;
    }

    d3.csv("./assets/data/data.csv").then(function(healthData, err) {
    if (err) throw err;
    
    // parse data
        //X:Poverty
        //  Age
        //  Income
        //Y:Healthcare
        //  Obesity
        //  Smokers
    healthData.forEach(function(data) {
        data.abbr=data.abbr;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(healthData, chosenXAxis);

    // Create y scale function
    var yLinearScale = yScale(healthData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        //.attr("transform", "rotate(-90)")
        .call(leftAxis);

    var abbrtext = (d) => {return d.abbr;};    
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

    circlesGroup
    .data(healthData)
    .enter()
    .append("text")
    .attr("class", "states")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .text(abbrtext);
    console.log(abbrtext)

     // append initial circles
    // var circlesGroup = chartGroup.selectAll(".dot")
    //  .data(healthData)
    //  .enter();

    //  circlesGroup
    //  .append("circle")
    //  .attr("cx", d => xLinearScale(d[chosenXAxis]))
    //  .attr("cy", d => yLinearScale(d[chosenYAxis]))
    //  .attr("r", 20)
    //  .attr("fill", "pink")
    //  .attr("opacity", ".5");
    
    // Create group for three x-axis labels
    // health data
        //X:Poverty
        //  Age
        //  Income

    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 10})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty");

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age");

    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Income");

    // append y axis
    //   chartGroup.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - margin.left)
    //     .attr("x", 0 - (height / 2))
    //     .attr("dy", "1em")
    //     .classed("axis-text", true)
    //     .text("Number of Billboard 500 Hits");

    // Create group for three y-axis labels
        //Y:Healthcare
        //  Obesity
        //  Smokers

    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var healthcareLabel = ylabelsGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Healthcare");

    var obesityLabel = ylabelsGroup.append("text")
        .attr("y", 0 - margin.left+20)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obesity");

    var smokersLabel = ylabelsGroup.append("text")
        .attr("y", 0 - margin.left+40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokers");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    xlabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        // health data
        //X:Poverty
        //  Age
        //  Income
    
        var xvalue = d3.select(this).attr("value");
        if (xvalue !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = xvalue;

            // console.log(chosenXAxis)

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(healthData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenXAxis === "age") {
            povertyLabel
                .classed("active", false)
                .classed("inactive", true)
            ageLabel
                .classed("active", true)
                .classed("inactive", false)
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenXAxis === "income"){
            povertyLabel
                .classed("active", false)
                .classed("inactive", true)
            ageLabel
                .classed("active", false)
                .classed("inactive", true)
            incomeLabel
                .classed("active", true)
                .classed("inactive", false);
            }
            else {
            povertyLabel
                .classed("active", true)
                .classed("inactive", false)
            ageLabel
                .classed("active", false)
                .classed("inactive", true)
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            }  
        }
    });



    ylabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        // health data
        //Y:Healthcare
        //  Obesity
        //  Smokers
    
        var yvalue = d3.select(this).attr("value");
        if (yvalue !== chosenYAxis) {

            // replaces chosenXAxis with value
            chosenYAxis = yvalue;

            // console.log(chosenXAxis)

            // functions here found above csv import
            // updates x scale for new data
            yLinearScale = yScale(healthData, chosenYAxis);

            // updates x axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenYAxis === "obesity") {
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true)
            obesityLabel
                .classed("active", true)
                .classed("inactive", false)
            smokersLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenYAxis === "smokes"){
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true)
            obesityLabel
                .classed("active", false)
                .classed("inactive", true)
            smokersLabel
                .classed("active", true)
                .classed("inactive", false);
            }
            else {
            healthcareLabel
                .classed("active", true)
                .classed("inactive", false)
            obesityLabel
                .classed("active", false)
                .classed("inactive", true)
            smokersLabel
                .classed("active", false)
                .classed("inactive", true);
            }  
        }
        });
    }).catch(function(error) {
    console.log(error);
    });
// }
   
    



   





