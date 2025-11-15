function setup() {
  console.log('setup called');
  createCanvas(400, 400);
  console.log('canvas created');
}

function draw() {
  console.log('draw called');
  background(220);
  fill(0);
  circle(200, 200, 100);
}
