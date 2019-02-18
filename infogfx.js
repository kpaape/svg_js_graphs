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

function drawLine(x1, y1, x2, y2, color="black", width=1) {
    var newLine = '<line x1="' + x1 + '%" y1="' + y1 + '%" x2="' + x2 + '%" y2="' + y2 + '%" class="graph-stroke-' + color + ' graph-stroke-width_' + width + '"/>';
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
    var graphMargins = 10;
    var graphHTML = "";

    switch(myData["graph-type"]) {
        case "line-graph":
            // draw graph
            // graphHTML += '<polyline points="20,20 40,25 60,40 80,120 120,140 200,180" class="black width_2 no-fill"/>';
            
            // draw x & y baselines
            graphHTML += drawLine(0, 0, 0, 100);
            graphHTML += drawLine(0, 100, 100, 100);
            
            // draw x & y labels

            // these should have there own section outside of the graph
            graphHTML += '<text x="1%" y="5%" class="graph-stroke-black graph-text">' + myData["y-label"] + '</text>';
            graphHTML += '<text x="95%" y="95%" class="graph-stroke-black graph-text">' + myData["x-label"] + '</text>';

            // get y marker data
            var yRange = myData["y-range"][1] - myData["y-range"][0];
            var yStep = 100 / yRange;
            // draw y markers
            // these need to be in the same section with the label
            for(var i = 1; i < yRange; i++) {
                if(i % myData["y-range"][2] == 0) {
                    var newY = 100-(yStep*i);
                    graphHTML += drawLine(0, newY, 5, newY);
                }
            }

            // get y marker data
            var xRange = myData["x-range"][1] - myData["x-range"][0];
            var xStep = 100 / xRange;
            // draw y markers
            // these need to be in the same section with the label
            for(var i = 1; i < xRange; i++) {
                if(i % myData["x-range"][2] == 0) {
                    var newX = xStep*i;
                    graphHTML += drawLine(newX, 100, newX, 95);
                }
            }

            // draw data line
            // graphHTML += drawPolyLine(myData);
            var lastX = 0;
            var lastY = 0;
            for(var i = 0; i < myData["graph-data"].length; i++) {
                var yLoc = Number(myData["graph-data"][i][1]) - myData["y-range"][0];
                console.log(yLoc);
                var xLoc = Number(myData["graph-data"][i][0]) - myData["x-range"][0];
                console.log(xLoc);
                newX = xStep*xLoc;
                newY = 100-(yStep*yLoc);
                if(i==0) {
                    lastX = newX;
                    lastY = newY;
                    // ctx.moveTo(graphMargins+(xStep*xLoc), graph.height-graphMargins-(yStep*yLoc));
                } else {
                    
                    graphHTML += drawLine(lastX, lastY, newX, newY, "red", 2);
                    lastX = newX;
                    lastY = newY;
                    // ctx.lineTo(graphMargins+(xStep*xLoc), graph.height-graphMargins-(yStep*yLoc));
                    // ctx.stroke();
                }
            }
            
            break;
        default:
            break;
    }

    graph.innerHTML += graphHTML;
}