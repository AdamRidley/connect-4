function CreateGrid(){
  this.grid = []
  this.diagnums=[]
  var maxPerDiag = min(gridWidth,gridHeight)-3;
  for(var i = 0;i<maxPerDiag;i++){
    this.diagnums.push(i+1);
  }
  for(var i = 0;i<abs(gridWidth-gridHeight);i++){
    this.diagnums.push(maxPerDiag);
  }
  for(var i = maxPerDiag-1;i>0;i--){
    this.diagnums.push(i);
  }

  for(var i=0;i<gridWidth;i++){
    this.grid.push([]);
    for(var j=0;j<gridHeight;j++){
      this.grid[i].push(-1);
    }
  }

  this.column = function(i){
    return this.grid[i];
  }

  this.getColumnPos = function(i,st,len){
    var pos = [];
    for (var j=0;j<len;j++){
      pos.push(createVector(i,st+j));
    }
    return pos;
  }

  this.row = function(i){
    var tempRow = []
    for (var j=0;j<gridWidth;j++){
      tempRow.push(this.grid[j][i]);
    }
    return tempRow;
  }

  this.getRowPos = function(i,st,len){
    var pos = [];
    for (var j=0;j<len;j++){
      pos.push(createVector(st+j,i));
    }
    return pos;
  }

  this.diagDR = function(i){
    if (i===undefined) return false;
    if (i>noDiags-1) return false;
    var startY = min(3+i,gridHeight-1);
    var startX = max(0,i-gridHeight+4);
    var tempRow = []
    // for (var j=0;j<noDiags;j++)
    for(j = 0;j<this.diagnums[i]+3;j++){
        tempRow.push(this.grid[startX+j][startY-j]);
    }
    return tempRow;
  }

  this.getDiagDRPos = function(i,st,len){
    if (i===undefined) return false;
    if (i>noDiags-1) return false;
    var startY = min(3+i,gridHeight-1);
    var startX = max(0,i-gridHeight+4);
    var pos = [];
    for (var j=0;j<len;j++){
      pos.push(createVector(startX+st+j,startY-st-j));
    }
    return pos;
  }

  this.diagDL = function(i){
    if (i===undefined) return false;
    if (i>gridWidth+gridHeight-8) return false;
    var startY = min(3+i,gridHeight-1);
    var startX = min(gridWidth-1,noDiags-i+2);
    var tempRow = []
    for(j = 0;j<this.diagnums[i]+3;j++){
        // console.log(startX+', '+startY+', '+j);
        tempRow.push(this.grid[startX-j][startY-j]);
    }
    return tempRow;
  }

  this.getDiagDLPos = function(i,st,len){
    if (i===undefined) return false;
    if (i>gridWidth+gridHeight-8) return false;
    var startY = min(3+i,gridHeight-1);
    var startX = min(gridWidth-1,noDiags-i+2);
    var pos = [];
    for (var j=0;j<len;j++){
      pos.push(createVector(startX-st-j,startY-st-j));
    }
    return pos;
  }

  this.cell = function(i,j){
    return this.grid[i][j];
  }

  this.columnNextSpace = function(i){
    if(i===undefined){
      return false
    }
    for(var j=0;j<gridHeight;j++){
      if (this.grid[i][j]===-1){
        return j
      }
    }
    return -1
  }

  this.addToColumn = function(i,col){
    var j = this.columnNextSpace(i);
    // console.log(j);
    if (!(j===false)){
      if (j>-1){
        this.grid[i][j] = col;
        counters.push(new Counter(i,j,col));
        // console.log('Added colour '+col+' at: '+i+', '+j);
        //Check diagDL is working for all diagonals
        // var temp = [];
        // for (var k=0;k<noDiags;k++){
        //   temp.push(this.diagDL(k));
        // }
        // console.log(temp);
        return true;
      }
      else{
        return false;
      }
  }
  }

  this.toText = function(){
    var out
    for(var i in grid){
      if(grid[i] instanceof Array){
        out = grid[i].join(", ");
      }
    }
    return out;
  }
}
