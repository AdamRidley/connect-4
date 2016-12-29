var counters = [];
var gridWidth = 7;
var gridHeight = 6;
var unitWidth;
var padding = 25;
var gridLeft;
var gridTop;
var unitPadding;
var circleSize;
var selection;
var p;
var grid;
var player = 0;
var winner = false;
var winningCol;
var winLoopCount = 0;
var noDiags;
var diagnums = [];
var multiplayer = false;
var myLog = [];
var aiDepth = 3;
var moveList = [];
var logging = true;
var pLog = false;

function setup() {
    noDiags = gridWidth + gridHeight - 7;
    createCanvas(windowWidth, windowHeight);
    recalcSizeVars();
    selection = new Counter(0, 0, 1);
    selection.colour = player
    selection.visible = false;
    var maxPerDiag = min(gridWidth, gridHeight) - 3;
    for (var i = 0; i < maxPerDiag; i++) {
        diagnums.push(i + 1);
    }
    for (var i = 0; i < abs(gridWidth - gridHeight); i++) {
        diagnums.push(maxPerDiag);
    }
    for (var i = maxPerDiag - 1; i > 0; i--) {
        diagnums.push(i);
    }
    grid = new CreateGrid();
}

checkMousePos = function() {
    // console.log(mouseX);
    // console.log(mouseY);

    if (mouseInGrid() && (grid.player === 0 || (grid.player === 1 && multiplayer))) {
        var x = int((mouseX - gridLeft) / unitWidth);
        if (grid.columnNextSpace(x) > -1) {
            selection.pos.x = x
            selection.pos.y = grid.columnNextSpace(x);
            selection.colour = player;
            selection.visible = true;
        } else {
            selection.visible = false;
        }
    } else {
        selection.visible = false;
    }
}

mouseInGrid = function() {
    return insideRect(mouseX, mouseY, gridLeft, gridTop, unitWidth * gridWidth, unitWidth * gridHeight)
}

insideRect = function(x, y, x1, y1, w, h) {
    return x >= x1 && x <= x1 + w - 1 && y >= y1 && y <= y1 + h - 1;
}

window.onresize = function() {
    resizeCanvas(windowWidth, windowHeight);
    recalcSizeVars();
}

recalcSizeVars = function() {
    unitWidth = min((width - 2 * padding) / gridWidth, (height - 2 * padding) / gridHeight);
    unitPadding = unitWidth * .05;
    circleSize = unitWidth * .9;
    gridLeft = (width - unitWidth * gridWidth) / 2;
    gridTop = (height - unitWidth * gridHeight) / 2
}

function mousePressed() {

    if (mouseInGrid() && !winner && (grid.player === 0 || (grid.player === 1 && multiplayer))) {
        var x = int((mouseX - gridLeft) / unitWidth);
        // console.log(grid.toText());
        var result = playMove(x);
        if (result && (!winner) && (!multiplayer)) {
            var aiResult = findResults(grid, aiDepth);
            if (pLog) console.log(aiResult);
            playMove(aiResult.bestMove);
        }
    }

}

playMove = function(x) {
    var result = grid.addToColumn(x, grid.player);
    if (result) {
        moveList.push(x);
        counters.push(new Counter(result.x, result.y, player));
        // console.log(grid.row(0));
        var tmp = checkWin(grid);
        winner = tmp.win;
        if (winner) {
            if (logging) myLog.push(moves());
            var p = tmp.positions;
            // console.log(p);
            // console.log(p[i].x+' '+p[i].y);
            for (j in counters) {
                for (i = 0; i < p.length; i++) {
                    var c = counters[j];
                    if (c.pos.x === p[i].x && c.pos.y === p[i].y) {
                        c.winningCounter = true;
                        break;
                    }
                }
            }
        } else {
            player = grid.player;
        }
    }
    return result;
}

moves = function() {
    return moveList.join(",");
}

printLog = function() {
    console.log("Writing File");
    saveJSON(myLog, 'data.json');
    console.log("Finished");
}

checkWin = function(gr) {
    var foundWin = false;
    var winningPos = [];
    var winningCol;
    for (var i = 0; i < gridWidth; i++) {
        var a = maxInRow(gr.column(i));
        if (a.max >= 4) {
            foundWin = true;
            winningCol = a.col;
            winningPos.push(...gr.getColumnPos(i, a.start, a.max));
        }
    }
    for (var i = 0; i < gridHeight; i++) {
        var a = maxInRow(gr.row(i));
        if (a.max >= 4) {
            foundWin = true;
            winningCol = a.col;
            winningPos.push(...gr.getRowPos(i, a.start, a.max));
        }
    }
    for (var i = 0; i < noDiags; i++) {
        var a = maxInRow(gr.diagDR(i));
        if (a.max >= 4) {
            foundWin = true;
            winningCol = a.col;
            winningPos.push(...gr.getDiagDRPos(i, a.start, a.max));
        }
    }
    for (var i = 0; i < noDiags; i++) {
        var a = maxInRow(gr.diagDL(i));
        if (a.max >= 4) {
            foundWin = true;
            winningCol = a.col;
            winningPos.push(...gr.getDiagDLPos(i, a.start, a.max));
        }
    }
    // console.log('Nope');
    if (foundWin) {
        // console.log(winningPos);
        return {
            win: true,
            positions: winningPos,
            col: winningCol
        };
    } else {
        return {
            win: false
        };
    }
    //vert
    //horiz
    //diags
}

function maxInRow(ar) {
    if (!(ar.constructor === Array)) return false;
    var max = 0;
    var tempMax = 0;
    var maxCol = -1;
    var col = -1;
    var st = 0;
    for (var i = 0; i < ar.length; i++) {
        if (ar[i] === col && col > -1) {
            tempMax += 1;
        } else {
            if (tempMax > max) {
                max = tempMax;
                st = i - max;
                maxCol = col;
            }
            col = ar[i];
            if (col > -1) {
                tempMax = 1;
            } else {
                tempMax = 0;
            }
        }
    }
    if (tempMax > max) {
        max = tempMax;
        st = ar.length - max;
        maxCol = col
    }
    // if(max>=4) console.log({max:max,startAt:st,col:maxCol});
    // console.log(max);
    return {
        max: max,
        start: st,
        col: maxCol
    };
}

findResults = function(gr, depth) {
    if (logging) myLog.push([depth, gr.toText()]);
    if (pLog) console.log(depth, gr.toText());
    var counts = []
    var fitness = 0;
    for (var j = 0; j < 2; j++) {
        counts.push(findNosInLine(gr, j));
    }
    if (counts[0][2] > 0) {
        fitness = -10 * (depth + 1)
    } else if (counts[1][2] > 0) {
        fitness = 10 * (depth + 1)
    } else {
        var dif;
        for (var a = 1; a >= 0; a--) {
            dif = counts[1][a] - counts[0][a];
            var adif = abs(dif);
            if (adif > 0) {
                dif = min(adif, 8) * (dif && dif / adif);
            }
            dif = map(dif / map(a, 1, 0, 1, 2), -8, 8, 0, 1);
            if (dif != 0.5) break;
        }
        fitness = dif;
    }
    if (depth === 0 || counts[0][2] > 0 || counts[1][2] > 0) {
        if (pLog) console.log(gr.grid, counts);
        return {
            fitness: fitness,
            bestMove: 0
        };
    }

    //depth>0 or more to play for
    var result = {
        fitness: 0,
        bestMove: 0
    };
    var foundMove = false
    var avgFit = 0;
    var availMoves = 0;
    var bestFit = 0;
    for (var j = 0; j < gridWidth; j++) {
        if (gr.columnNextSpace(j) != -1) {
            availMoves++;
            var tempGrid = new CreateGrid(gr.grid, gr.player);
            tempGrid.addToColumn(j);
            var tempRes = findResults(tempGrid, depth - 1);
            if (logging) myLog.push(tempRes, depth);
            if (pLog) console.log(tempRes, depth);
            if (bestFit < tempRes.fitness || foundMove === false) {
                foundMove = true;
                bestFit = tempRes.fitness;
                result.bestMove = j;
            }
            avgFit += tempRes.fitness;
        }
    }
    if (availMoves === 0) {
        //end of game
        result.fitness = 1;
    } else {
        result.fitness = avgFit / availMoves;
        if (logging) myLog.push(result.fitness);
    }
    return result;
}

findNosInLine = function(gr, col) {
    var nos = [];
    for (var i = 0; i < 3; i++) nos.push(0);
    for (var i = 0; i < gridWidth; i++) {
        var a = findNosInRow(gr.column(i), col);
        for (var j = 0; j < 3; j++) nos[j] += a[j];
    }
    for (var i = 0; i < gridHeight; i++) {
        var a = findNosInRow(gr.row(i), col);
        for (var j = 0; j < 3; j++) nos[j] += a[j];
    }
    for (var i = 0; i < noDiags; i++) {
        var a = findNosInRow(gr.diagDR(i), col);
        for (var j = 0; j < 3; j++) nos[j] += a[j];
    }
    for (var i = 0; i < noDiags; i++) {
        var a = findNosInRow(gr.diagDL(i), col);
        for (var j = 0; j < 3; j++) nos[j] += a[j];
    }
    return nos;
}

findNosInRow = function(ar, col) {
    //modified to account for space to grow to atleast 4 in a row
    if (!(ar.constructor === Array)) return false;
    var lengths = [];
    for (var i = 0; i < ar.length - 3; i++) {
        var blocked = false;
        var noCols = 0;
        for (var j = 0; j < 4; j++) {
            if (ar[i + j] === col) {
                noCols++;
            } else if (ar[i + j] === 1 - col) {
                blocked = true;
                break;
            }
        }
        if (blocked === false && noCols >= 2) {
            lengths.push(noCols);
        }
    }
    var nos = [0, 0, 0]; //nos:[0=no of 2s,1=no of 3s,2 = no of 4 or more]
    //for (var i = 0; i < 3; i++) nos.push(0);
    for (var i in lengths) {
        var num = lengths[i];
        if (num > 1) {
            num = min(4, num) - 2; //limits max to 4 in a row
            nos[num]++;
        }
    }
    return nos;
}

setGrid = function(gr) {
    grid.grid = gr;
    for (i = 0; i < 7; i++) {
        for (j = 0; j < 6; j++) {
            if (gr[i][j] !== -1) {
                counters.push(new Counter(i, j, gr[i][j]));
            }
        }
    }
}

function draw() {
    if (winner) {
        winLoopCount = (winLoopCount + 1) % 100
    } else {
        checkMousePos();
    }
    background(50);
    stroke(50, 50, 255);
    strokeWeight(1);
    fill(50, 50, 155);
    rect(gridLeft, gridTop, unitWidth * gridWidth, unitWidth * gridHeight);
    stroke(30, 30, 120);
    strokeWeight(3);
    fill(0);
    for (var i = 0; i < gridWidth; i++) {
        for (var j = 0; j < gridHeight; j++) {
            ellipse(gridLeft + unitWidth * (i + 1 / 2), gridTop + unitWidth * ((gridHeight - j - 1) + 1 / 2), circleSize);
        }
    }
    //counters[0].show();
    for (var i in counters) {
        counters[i].show();
    }
    if (!winner) {
        if (selection) {
            selection.show();
        }
    }
}
