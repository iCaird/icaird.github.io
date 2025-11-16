let nodes = [];
let line_pad = 0
let circles = [];
let leftButton;
let rightButton;
let resetButton;
let started = false;
let TEXT_SIZE = 16;
function setup() {
  pixelDensity(1);
  createCanvas(window.innerWidth,window.innerHeight);
  background(220);
  tex = createP();
  tex.style("'font-size', '14px'");
  tex.position(0,0);
  leftButton = createButton('L');
  rightButton = createButton('R');
  leftButton.position(10, height + -25);
  rightButton.position(35, height + -25);
  leftButton.mousePressed(() => left());
  rightButton.mousePressed(() => right());
  resetButton = createButton('Reset');
  resetButton.position(62.5, height + -25);
  resetButton.mousePressed(() => {
    nodes = [{
    x: width / 2,
    val: [1, 1],
    y : 10,
    a: 255,
    vel: 1,
    acc: 0.03
  }];
    circles = [];
    started = false;
  });
  nodes.push({
    x: width / 2,
    val: [1, 1],
    y : 10,
    a: 255,
    vel: 1,
    acc: 0.03
  });
}



function draw() {
  background(15, 23, 42);
  translate(0, height/2);
  textAlign(CENTER, CENTER)
  stroke(120)
  line(line_pad, -line_pad, width - line_pad, -line_pad)

  for (let c of circles) {
    if (c.a <= 5) circles.splice(circles.indexOf(c), 1);
    push()
    noFill();
    colorMode(HSB)
    stroke(map(c.a,255,0,0,360), 255, 100, c.a);
    strokeWeight(map(c.a, 0, 255, 2, 6))
    // circle(c.x,-line_pad,c.d);
    arc(c.x, -line_pad, c.d, c.d, c.dir == -1 ? PI : 0, c.dir == -1 ? 0 : PI);
    pop();
  }
  for (let node of nodes) {
    if (node.a <= 5) nodes.splice(nodes.indexOf(node), 1);
    push()
    colorMode(HSB);
    fill(map(node.a,255,0,0,360),100,255,node.a);
    strokeWeight(0.1);
    noStroke();
    //circle(node.x, -line_pad, 5);
    if (started) {

    node.y += node.y > 0 ? node.vel : -node.vel;
    node.vel += node.acc;
    }
    pop();
  }
  push();
  colorMode(HSB);
  textAlign(CENTER, CENTER);
    textSize(TEXT_SIZE);
    textFont("monospace");
    noStroke();
  for (let node of nodes) {
    let colr = map(node.a,255,0,0,360);
    fill(colr,100,255,node.a);
    // text(`${node.val[0]}/${node.val[1]}`, node.x, node.y);
    drawFraction(node.val[0], node.val[1], node.x, node.y + 10,colr);
  }
  pop();


}

function drawFraction(num, den, x, y, c) {
  text(num, x, y - 10);
  push();
  let numWidth = textWidth(num);
  let denWidth = textWidth(den);
  let maxWidth = max(numWidth, denWidth);
  stroke(c,100,255);
  line(x - maxWidth / 2, y, x + maxWidth / 2, y);
  pop();
  text(den, x, y + 10);
}
function left() {
  let lastnode = nodes.at(-1);
  let lastnum = lastnode.val[0];
  let lastden = lastnode.val[1];
  started = true;
  nodes.push({
      x: map(lastnum / (lastnum + lastden), 0, 1, 0, width / 2),
      val: [lastnum, lastnum + lastden],
      y : 10,
      a: 255,
      vel: 1,
      acc: 0.03
    })
    let currnode = nodes.at(-1);
    let x = (lastnode.x + currnode.x) / 2
    let d = abs(lastnode.x - currnode.x)

    circles.push({
      x: x,
      d: d,
      a: 255,
      dir : -1
    })
    for (let c of circles) {
      c.a -= 10;
    } 
    for (let n of nodes) {
      n.a -= 10;
    }
}
function right() {
  started = true;
  let lastnode = nodes.at(-1);
  let lastnum = lastnode.val[0];
  let lastden = lastnode.val[1];
  nodes.push({
      x: map(lastden/(lastden+lastnum), 0, 1, width, width/2),
      val: [lastnum + lastden, lastden],
      y : -10,
      a: 255,
      vel: 1,
      acc: 0.03
    })
    let currnode = nodes.at(-1);
    let x = (lastnode.x + currnode.x) / 2
    let d = abs(lastnode.x - currnode.x)
    circles.push({
      x: x,
      d: d,
      a: 255,
      dir : 1
    })
    for (let c of circles) {
      c.a -= 10;
    }
    for (let n of nodes) {
      n.a -= 10;
    }
}
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
left();
  } else if (keyCode === RIGHT_ARROW) {
    right();
  } else if (key === 'r') {
    started = false;
    nodes = [{
    x: width / 2,
    val: [1, 1],
    y : 10,
    a: 255,
    vel: 1,
    acc: 0.03
  }];
    circles = [];
  }
}

