let rims = [];
let selected = 0;
let p;
let n = 8;
let input = "";
let stepSize = 30;
let numCols;
let numRows;
let gridGraphics;
let grid = true;
let globalPoints = [];
let showGens = false;
let rimLabels = [];

function setup() {
  let myCanvas = createCanvas(window.innerWidth, window.innerHeight);
  gridGraphics = createGraphics(window.innerWidth, window.innerHeight);
  preRenderGrid();
  numCols = width/stepSize;
  numRows = height/stepSize;
  myCanvas.parent("testDiv");
  // rim = new Rim([1,2,4,7],8,createVector(0,0),50,50);
  // p = createP("");
  // p.style("font-family", "Consolas");
  // p.position(width/2,height/2);
  // for (let i = 0; i < 8; i++) {
    // 	rims.push(
      // 		new Rim(
        // 			[
          // 				floor(random(1, 9)),
          // 				floor(random(1, 9)),
          // 				floor(random(1, 9)),
          // 				floor(random(1, 9)),
          // 			],
        // 			8,
        // 			createVector(
          // 				50*floor(random(-width / 2, width / 2)/50),
          // 				50*floor(random(-height / 2, height / 2)/50)
          // 			),
        // 			50,
        // 			50
        // 		)
      // 	);
    // }
}

function draw() {
  background(220);
  globalPoints = [];
  for(let rim of rims){
    for(let pos of rim.gridPos){
      globalPoints.push({'pos': pos['pos'].copy(),'value': pos['value']*rim.multiplier});
    }
  }
  if(grid){
    image(gridGraphics,0,0);
  }

  translate(width / 2, height / 2);
  stroke(0);
  fill(0);

  push();
  stroke(0);
  fill(0);
  strokeWeight(4);
  // rim.show();

  for (let rim of rims) {
    strokeWeight(4);
    stroke(0,0,0,128);
    fill(0,0,0,128);
    if (rims.indexOf(rim) == selected) {
      strokeWeight(8);
      fill(255,0,0,128);
      stroke(255,0,0,128);
    }
    rim.show();
  }


  

  pop();
// DISPLAY LABELS AT THE TOP
  push();
  stroke(0);
  colorMode(HSB);
  let textCols = []; 
  for(let i = 0; i < rimLabels.length; i++){
    textCols.push(rims[i].colour);
  }
  textAlign(LEFT,TOP);
  for(let i = 0; i < rimLabels.length; i++){
    fill(textCols[i]);
    if(i == selected){
      strokeWeight(8);
    } else {
      strokeWeight(4);
    }
    text(rimLabels[i] + " ",-width/2 + i*textWidth(rimLabels[i] + " "),-height/2);
  }
  pop();
  //=============================
  textAlign(CENTER,CENTER);
  textSize(64);
  textFont("Courier New");
  textStyle(BOLD)
  text(input,0,0);
  textAlign(RIGHT,TOP)
  text(`n=${n}`,width/2,-height/2);

  push();
  textSize(16); 
  translate(-width/2,-height/2);
  for(let i = -17; i < numCols; i++){
    for(let j = -33; j < numRows; j++){
      let vect = createVector(i,j);
      let numGens = 0;
      for(let pos of globalPoints){
        if(pos['pos'].equals(vect)){
          numGens += pos['value'];
        }
      }
      // numGens = globalPoints.filter(e => e['pos'].equals(vect)).length;
      // console.log(numGens);
      textAlign(CENTER,CENTER);
      if((j % 2) == 0){
        if(numGens && showGens){
          text(numGens,i*2*stepSize+17*15,j*stepSize+33*15+stepSize);
        }
      } else {
        if(numGens && showGens){
          text(numGens,i*2*stepSize + stepSize + 17*15,j*stepSize+33*15+stepSize);
        }
      }

    }
  }
  pop();
  // console.log(input);


}

function keyPressed(e) {
  //e.preventDefault();
  console.log(key);
  if(keyIsDown(78)){
    n=parseInt(input);
    input = "";
    return;
  }

  if( keyCode === 32){
    // console.log("SPACE!");
    e.preventDefault();
    input += " ";
  }


  if( keyCode === ENTER){
    rims.push(new Rim(input.split(' ').map(Number),n,createVector(-width/2+17*15,-height/2+33*15),stepSize,stepSize));
    selected = rims.length-1;
    input = "";
    // p.html("");
    
    rimLabels.push(rims[selected].label.sort().join(""));
    return;
  }

  if(48 <= keyCode && keyCode <= 57 && !keyIsDown(16)){
    input = input + key;
    // p.html(input);
  }

  if (keyCode === LEFT_ARROW) {
    for (let rim of rims) {
      if(rims.indexOf(rim) == selected){
        rim.moveTracker[0] -= 1;
        rim.sv.x -= 2*rim.w;
        for( let pos of rim.gridPos){
          pos['pos'].x -= 1;
        }
      }
    }
  }
  if (keyCode === RIGHT_ARROW) {
    for (let rim of rims) {
      if(rims.indexOf(rim) == selected){
        rim.moveTracker[0] += 1;
        rim.sv.x += 2*rim.w;
        for( let pos of rim.gridPos){
          pos['pos'].x += 1;
        }
      }
    }
  }
  if (keyCode === UP_ARROW) {
    e.preventDefault();
    for (let rim of rims) {
      if(rims.indexOf(rim) == selected){
      rim.moveTracker[1] -= 1;
        rim.sv.y -= 2*rim.h;
        for( let pos of rim.gridPos){
          pos['pos'].y -= 2;
        }
      }
    }
  }
  if (keyCode === DOWN_ARROW) {
    e.preventDefault();
    for (let rim of rims) {
      if(rims.indexOf(rim) == selected){
        rim.moveTracker[1] += 1;
        rim.sv.y += 2*rim.h;
        for( let pos of rim.gridPos){
          pos['pos'].y += 2;
        }
      }
    }
  }

  if (key == "c") {
    for (let rim of rims) {
      if(rims.indexOf(rim) == selected){
        rim.cycle(1);
      }

    }
    rimLabels[selected ]= rims[selected].label.sort().join("");

  }

  if (key == "x") {
    for (let rim of rims) {
      if(rims.indexOf(rim) == selected){
        rim.cycle(-1);
      }
    }
    rimLabels[selected ]= rims[selected].label.sort().join("");
  }

  if(keyCode == TAB){
    e.preventDefault();
    if(keyIsDown(16)){
      selected = (selected-1 + rims.length) % rims.length;
    } else {
      selected = (selected+1 + rims.length) % rims.length;
    }

  }

  if(key == 'z'){
    selected--;
    rimLabels.pop();
    rims.pop();
  }

  if(key == '-'){
    gridGraphics = createGraphics(window.innerWidth, window.innerHeight);
    stepSize -= 5;
    for(let rim of rims){
      rim.h -=5;
      rim.w -=5;
    }
    preRenderGrid();
  }

  if(key == '='){
    gridGraphics = createGraphics(window.innerWidth, window.innerHeight);
    stepSize += 5;
    for(let rim of rims){
      rim.h += 5;
      rim.w += 5;
      // rim.sv.x += 5;
    }
    preRenderGrid();
  }

  if(key == "f"){
    rims[selected].flip();
  }

  if(key == "d"){
    rims.push(rims[selected].clone());
    selected++;
  }

  if(key == "g"){
    grid = !grid;
  }

  if(key == "l"){
    for(let rim of rims){
      rim.showLabelFlag = !rim.showLabelFlag;
    }
  }

  if(keyCode == BACKSPACE){
    input = input.slice(0,-1);
  }

  if(key == "s"){
    rims[selected].multiplier *= -1;
    // for(let p of rims[selected].gridPos){
      // p['value'] *= -1;
    // }
  }

  if(key == "v") {
    showGens = !showGens
  }
  

  if(key == "h"){
    rims[selected].colour = [random(360),100,100,128];
  }

  if(48 <= keyCode && keyCode <= 57 && keyIsDown(16)){
    console.log("SETTING COLOUR");
    let c = (keyCode - 49) === -1 ? 10 : (keyCode - 49);
    rims[selected].colour = [c *360/11,100,100,128];
  }

  if(key == "r"){
    rims.splice(selected,1);
    rimLabels.splice(selected,1);
  }

  if(key == "p") {
    console.log(new Array(input.split(' ').map(Number).map((v,i) => {i+1})));
    rims.push(new Rim(new Array(parseInt(input)).fill(0).map((v,i) => i+1),n,createVector(-width/2+17*15,-height/2+33*15),stepSize,stepSize));
    selected = rims.length-1;
    input = "";
    // p.html("");
    
    rimLabels.push(rims[selected].label.sort().join(""));
    return;

  }
}



function preRenderGrid(){
  gridGraphics.push();
  gridGraphics.fill(150);
  gridGraphics.stroke(150);
  gridGraphics.textSize(8);
  let numCols = width/stepSize;
  let numRows = height/stepSize;

  for(let i = 0; i < numCols; i++){
    for(let j = 0; j < numRows; j++){
      if((j % 2) == 0){
        gridGraphics.circle(i*2*stepSize+15,j*stepSize+15,10);
        //gridGraphics.text(`${i},${j}`,i*2*stepSize+15,j*stepSize+15);
      } else {
        gridGraphics.circle(i*2*stepSize + stepSize + 15,j*stepSize+15,10);
        //gridGraphics.text(`${i},${j}`,i*2*stepSize+ stepSize + 15,j*stepSize+15);
      }

    }
  }
  gridGraphics.pop();
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  gridGraphics = createGraphics(window.innerWidth, window.innerHeight);
  preRenderGrid();
}










