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
var winLoopCount=0;
var noDiags;

function setup() {
  noDiags = gridWidth+gridHeight-7;
  createCanvas(windowWidth,windowHeight);
  recalcSizeVars();
  selection = new Counter(0,0,1);
  selection.colour = player
  selection.visible = false;
  grid = new CreateGrid();
}


checkMousePos = function(){
  // console.log(mouseX);
  // console.log(mouseY);

  if (mouseInGrid()){
    var x = int((mouseX-gridLeft)/unitWidth);
    if (grid.columnNextSpace(x)>-1){
      selection.pos.x = x
      selection.pos.y = grid.columnNextSpace(x);
      selection.colour = player;
      selection.visible = true;
    }
    else{
      selection.visible = false;
    }
  }else{
    selection.visible = false;
  }
}

mouseInGrid = function(){
  return insideRect(mouseX,mouseY,gridLeft,gridTop,unitWidth*gridWidth,unitWidth*gridHeight)
}

insideRect = function(x,y,x1,y1,w,h){
  return x>=x1&&x<=x1+w-1&&y>=y1&&y<=y1+h-1;
}

window.onresize = function(){
  resizeCanvas(windowWidth,windowHeight);
  recalcSizeVars();
}

recalcSizeVars = function(){
  unitWidth = min((width-2*padding)/gridWidth,(height-2*padding)/gridHeight);
  unitPadding = unitWidth*.05;
  circleSize = unitWidth*.9;
  gridLeft = (width-unitWidth*gridWidth)/2;
  gridTop = (height-unitWidth*gridHeight)/2
}

function mousePressed(){

  if (mouseInGrid()&&!winner){
    var x = int((mouseX-gridLeft)/unitWidth);
    // console.log(grid.toText());
    var result = grid.addToColumn(x,player);
    if (result){
      // console.log(grid.row(0));
      var tmp =checkWin(grid);
      winner = tmp.win;
      if(winner){
        var p = tmp.positions;
        // console.log(p);
          // console.log(p[i].x+' '+p[i].y);
          for(j in counters){
          for (i=0;i<p.length;i++){
            var c = counters[j];
            if (c.pos.x === p[i].x&&c.pos.y === p[i].y){
              c.winningCounter=true;
              break;
            }
          }
        }
      }
      else{
        player = 1-player;
      }
    }
  }

}
checkWin=function(gr){
  var foundWin=false;
  var winningPos = [];
  var winningCol;
  for(var i=0;i<gridWidth;i++){
    var a = maxInRow(gr.column(i));
    if (a.max>=4){
       foundWin= true;
       winningCol=a.col;
       winningPos.push(...gr.getColumnPos(i,a.start,a.max));
     }
  }
  for(var i=0;i<gridHeight;i++){
    var a=maxInRow(gr.row(i));
    if (a.max>=4){
      foundWin= true;
      winningCol=a.col;
      winningPos.push(...gr.getRowPos(i,a.start,a.max));
    }
  }
  for(var i=0;i<noDiags;i++){
    var a = maxInRow(gr.diagDR(i));
    if (a.max>=4){
      foundWin= true;
      winningCol=a.col;
      winningPos.push(...gr.getDiagDRPos(i,a.start,a.max));
    }
  }
  for(var i=0;i<noDiags;i++){
    var a = maxInRow(gr.diagDL(i));
    if (a.max>=4){
       foundWin= true;
       winningCol=a.col;
       winningPos.push(...gr.getDiagDLPos(i,a.start,a.max));
     }
  }
  // console.log('Nope');
  if(foundWin){
    // console.log(winningPos);
    return {
      win:true,
      positions:winningPos,
      col:winningCol
    };
  }
  else{
    return {win:false};
  }
  //vert
  //horiz
  //diags
}

function maxInRow(ar){
  if(!(ar.constructor === Array)) return false;
  var max=0;
  var tempMax=0;
  var maxCol = -1;
  var col=-1;
  var st=0;
  for(var i=0;i<ar.length;i++){
    if (ar[i]===col&&col>-1){
      tempMax+=1;
    }else{
      if (tempMax>max){
        max = tempMax;
        st= i-max;
        maxCol=col;
      }
      col=ar[i];
      if(col>-1){
        tempMax=1;
      }
      else{
        tempMax=0;
      }
    }
  }
  if (tempMax>max){
    max = tempMax;
    st = ar.length-max;
    maxCol = col;
  }
  // if(max>=4) console.log({max:max,startAt:st,col:maxCol});
  // console.log(max);
  return {
    max:max,
    start:st,
    col:maxCol
  };
}

function draw() {
  if(winner){
    winLoopCount = (winLoopCount+1)%100
  }else{
    checkMousePos();
  }
  background(50);
  stroke(50,50,255);
  strokeWeight(1);
  fill(50,50,155);
  rect(gridLeft,gridTop,unitWidth*gridWidth,unitWidth*gridHeight);
  stroke(30,30,120);
  strokeWeight(3);
  fill(0);
  for(var i=0;i<gridWidth;i++){
    for(var j=0;j<gridHeight;j++){
      ellipse(gridLeft+unitWidth*(i+1/2),gridTop+unitWidth*((gridHeight-j-1)+1/2),circleSize);
    }
  }
  //counters[0].show();
  for(var i in counters){
    counters[i].show();
  }
  if(!winner){
    if (selection){
      selection.show();
    }
  }
}
