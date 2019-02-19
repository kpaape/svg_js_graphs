var graphColors = ["red", "blue", "green", "orange", "purple"];

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myData = JSON.parse(this.responseText);
        for(var i = 0; i < myData.length; i++) {
            procGraphData(myData[i]);
        }
    }
};
xmlhttp.open("GET", "data.json", true);
xmlhttp.send();

function drawLine(x1, y1, x2, y2, color="black", width=1, graphType="") {
    var unit = (graphType == "bar-graph") ? "%" : "";
    console.log(unit);
    var newLine = '<line x1="' + x1 + '%" y1="' + y1 + '%" x2="' + x2 + '%" y2="' + y2 + '%" style="stroke:'+color+';stroke-width:'+width+unit+'"/>';
    return newLine;
}

function drawPolyLine(myData, color="red", width=2) {
    // sadly, drawing the data with a poly line will not work since you cannot place poly points at percentages
    var points = "";
    for(var i = 0; i < myData["graph-data"].length; i++) {
        var yLoc = Number(myData["graph-data"][i][1]) - myData["y-range"][0];
        console.log(yLoc);
        var xLoc = Number(myData["graph-data"][i][0]) - myData["x-range"][0];
        console.log(xLoc);
        points += "" + xLoc + "%," + yLoc + "% ";
        console.log(points);
    }
    var newLine = '<polyline points="' + points + '" class="graph-stroke-' + color + ' graph-stroke-width_' + width + ' graph-no-fill"/>';
    return newLine;
}

function procGraphData(myData) {
    var graph = document.getElementById(myData["graph-id"]);
    var graphHTML = "";

    if(myData["graph-type"] == "line-graph" || myData["graph-type"] == "bar-graph") {
        // draw graph
        // get x marker data
        console.log("gotcha x2")
        var xRange = myData["x-range"][1] - myData["x-range"][0];
        var xStep = 100 / xRange;
        // get y marker data
        var yRange = myData["y-range"][1] - myData["y-range"][0];
        var yStep = 100 / yRange;

        // draw data line
        // graphHTML += drawPolyLine(myData);
        var lastX = 0;
        var lastY = 0;
        for(var i = 0; i < myData["graph-data"].length; i++){
            var graphData = myData["graph-data"][i];
            for(var j = 0; j < graphData.length; j++) {
                var yLoc = Number(graphData[j][1]) - myData["y-range"][0];
                var xLoc = Number(graphData[j][0]) - myData["x-range"][0];
                var newX = xStep*xLoc;
                var newY = 100-(yStep*yLoc);
                if(myData["graph-type"] == "line-graph") {
                    if(j==0) {
                        lastX = newX;
                        lastY = newY;
                    } else {
                        graphHTML += drawLine(lastX, lastY, newX, newY, graphColors[i%graphColors.length], 2);
                        lastX = newX;
                        lastY = newY;
                    }
                } else if(myData["graph-type"] == "bar-graph") {
                    var lineWidth = xStep / myData["graph-data"].length;
                    graphHTML += drawLine(newX+(i*lineWidth), 100, newX+(i*lineWidth), newY, graphColors[i%graphColors.length], lineWidth, "bar-graph");
                }
            }
        }
    } else {
        switch(myData["graph-type"]) {
            case "pie-graph":
                console.log("in progress");
                
                break;
            
            default:
                break;
        }
    }

    graphHTML += drawGraphLabels(myData, graphHTML, xRange, xStep, yRange, yStep);
    graph.innerHTML += graphHTML;
}

function drawGraphLabels(myData, graphHTML, xRange, xStep, yRange, yStep) {
    // draw x & y baselines
    graphHTML += drawLine(0, 0, 0, 100);
    graphHTML += drawLine(0, 100, 100, 100);
    
    // draw x & y labels
    // these should have their own section outside of the graph
    graphHTML += '<text x="1%" y="5%" class="graph-stroke-black graph-text">' + myData["y-label"] + '</text>';
    graphHTML += '<text x="95%" y="95%" class="graph-stroke-black graph-text">' + myData["x-label"] + '</text>';

    // draw x markers
    // these need to be in the same section with the label
    for(var i = 1; i < xRange; i++) {
        if(i % myData["x-range"][2] == 0) {
            var newX = xStep*i;
            graphHTML += drawLine(newX, 100, newX, 95);
        }
    }

    // draw y markers
    // these need to be in the same section with the labels
    for(var i = 1; i < yRange; i++) {
        if(i % myData["y-range"][2] == 0) {
            var newY = 100-(yStep*i);
            graphHTML += drawLine(0, newY, 5, newY);
        }
    }
    return graphHTML;
}