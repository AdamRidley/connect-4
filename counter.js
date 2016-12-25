function Counter(x,y,colour) {
  this.pos = createVector(x,y);
  this.colour = colour;
  this.visible = true
  this.winningCounter = false;

  this.show = function() {
    if (this.visible){
      stroke(30,30,120);
      strokeWeight(3);
      if (this.colour === 0) {
        fill(255,255,0) ;
      } else if (this.colour === 1){
        fill(255,0,0);
      } else{
        fill(255);
      }
      if (winner&&winLoopCount<50&&this.winningCounter){
        fill(0,0,255);
      }
      ellipse(gridLeft+unitWidth*(this.pos.x+1/2),gridTop+unitWidth*((gridHeight-this.pos.y-1)+1/2),circleSize);
    }
  }
}
