class Rim {
  constructor(label,n,sv,w,h) {
    this.n=n;
    this.k = label.length;
    this.label = label;
    this.gridPos = [];
    this.value = 1;
    this.gridPos.push({ 'pos': createVector(0,0),
      'value': 1});
    this.stepDirs = this.makeStepDirs(label);
    this.sv = sv;
    this.w = w;
    this.h = h;
    this.showLabelFlag = true;
    this.colour = [random(360),100,100,128];
    this.makeRestGridPos();
    this.moveTracker = [0,0];
    this.multiplier = 1;
  }

  makeRestGridPos(){
  }


  makeStepDirs(l){
    //downsteps are encoded with a 1, makes sense with y coordinate stuff
    let stepDirs = [];
    for(let j = 0; j < 10; j++){
      for(let i = 1; i <= this.n; i++){
        let prevGridPos = this.gridPos[i-1]['pos'];
        // console.log(prevGridPos);
        let curPos;
        if(l.includes(i)){
          stepDirs.push(1);
          if(prevGridPos.y % 2 == 0){
            curPos = createVector(prevGridPos.x,prevGridPos.y+1 + 2*j);
          } else {
            curPos = createVector(prevGridPos.x+1,prevGridPos.y+1 + 2*j);
          }
        }else {
          stepDirs.push(-1);
          if(prevGridPos.y % 2 == 0){
            curPos = createVector(prevGridPos.x,prevGridPos.y-1 + 2*j);
          } else {
            curPos = createVector(prevGridPos.x+1,prevGridPos.y-1 + 2*j);
          }
        }
        // console.log(curPos);
        this.gridPos.push( {
          'pos' : curPos,
          'value' : this.value
        });
        // for (let i = 0; i < 10; i++) {
          //  let morePos = createVector(curPos.x,curPos.y + 2*i);
          //       this.gridPos.push({
            //           'pos': morePos,
            //           'value': this.value
            //       });
          //   }


      }
    }
    const foo = this.gridPos[0].pos;
    for (let j = 1; j < 10; j++) {
      let morePos = createVector(foo.x,foo.y + 2*j);
      this.gridPos.push({
        'pos': morePos,
        'value': this.value
      });
    }



    return stepDirs;
  }

  show(){
    // for(let i = 0; i < this.n; i++){
      //     console.table(this.gridPos[i]);
      // }
    // console.log('\n\n\n\n\n');
    let curX = this.sv.x;
    let curY = this.sv.y;
    push();
    for(let i = 0; i < this.n; i++){
      let nextX = curX + this.w;
      let nextY = curY + this.h*this.stepDirs[i];

      colorMode(HSB);
      fill(this.colour);
      stroke(this.colour);
      line(curX,curY,nextX,nextY);
      circle(curX,curY,10);

      curX = nextX;
      curY = nextY;
    }
    circle(curX,curY,10);
    pop();

    if(this.showLabelFlag){
      this.showLabel();
    }
  }

  makeAbsolute(){
    let absolute = [0];
    let tracker = 0;
    for(let i = 0; i < this.n; i++){
      if(this.label.includes(i)){
        tracker++;

      }else {
        tracker--;

      }
      absolute.push(tracker);
    }
    return absolute;
  }

  cycle(dir){

    let temp = this.stepDirs;
    let oldSv = this.sv.copy();
    let off;
    if(dir == 1){
      this.sv.y += -temp[temp.length-1]*this.h-30;
    } else if (dir == -1) {
      this.sv.y += temp[0]*this.h+30;
    }
    off = this.sv.y - oldSv.y;
    if (off > 0) {
      this.moveTracker[1] += 1;
    }
    if (off < 0) {
      this.moveTracker[1] -= 1;
    }

    this.label = this.label.map((e) => {
      if((e+dir) % this.n == 0){
        return this.n;
      } else {
        return (e+dir) % this.n; 
      }
    });

    console.log(`MOVE TRACKERS ${this.moveTracker}`);
    this.gridPos = [{'pos': createVector(this.moveTracker[0],2*this.moveTracker[1]), 'value': abs(this.gridPos[0]['value'])}];

    this.stepDirs = this.makeStepDirs(this.label);
  }

  flip(){
    let en = [...Array(n).keys()].map(e => { return e+1});

    this.label = en.filter(e => !this.label.includes(e));

    this.gridPos = [{'pos': createVector(this.sv.x,this.sv.y), 'value': this.gridPos[0]['value']}];
    this.stepDirs = this.makeStepDirs(this.label);
  }


  clone(){
    return new Rim(this.label,this.n, this.sv.copy(), this.w,this.h);
  }

  showLabel(){
    push();
    stroke(0);
    fill(0);
    strokeWeight(1);
    textAlign(RIGHT,CENTER);
    textStyle(NORMAL);
    textSize(16);
    text(this.label.join(" "),this.sv.x-20,this.sv.y);
    pop();
  }

  toggleSubtract(){

    this.multiplier *= -1;
  }
}
