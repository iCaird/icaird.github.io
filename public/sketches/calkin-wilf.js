let nodes = [];
let line_pad = 0
let circles = [];
function setup() {
  createCanvas(400, 400);
  background(220);
  nodes.push({
    x: width / 2,
    val: [1, 1],
    y : 10
  })
}

function draw() {
  background(220);
  translate(0, height/2);
  textAlign(CENTER, CENTER)
  line(line_pad, -line_pad, width - line_pad, -line_pad)
  for (let c of circles) {
    push()
    noFill();
    stroke(0, 0, 0, c.a);
    strokeWeight(map(c.a, 0, 255, 1, 4))
    // circle(c.x,-line_pad,c.d);
    arc(c.x, -line_pad, c.d, c.d, c.dir == -1 ? PI : 0, c.dir == -1 ? 0 : PI);
    pop();
    if (c.a <= 0) circles.splice(circles.indexOf(c), 1);
  }
  for (let node of nodes) {
    fill(0);
    circle(node.x, -line_pad, 5)
    text(`${node.val[0]}/${node.val[1]}`, node.x, node.y)
    node.y += node.y > 0 ? 1 : -1;
  }


}


function keyPressed() {
  console.log(circles);
  let lastnode = nodes.at(-1);
  let lastnum = lastnode.val[0];
  let lastden = lastnode.val[1];
  if (keyCode === LEFT_ARROW) {

    nodes.push({
      x: map(lastnum / (lastnum + lastden), 0, 1, line_pad, width / 2),
      val: [lastnum, 2 * lastnum + lastden],
      y : 10
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
    console.log(circles[0].a);
  } else if (keyCode === RIGHT_ARROW) {
    nodes.push({
      x: map(log((lastnum + lastden) / lastden), log(1), log(20), width / 2, width - line_pad),
      val: [lastnum + lastden, lastden],
      y : -10
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

  } else if (key === 'r') {
    nodes = [nodes[0]];
    circles = [];
  }
}

