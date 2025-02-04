angle = 0;


function setup() {
   canvas = createCanvas(400, 400).parent("sketch-wrapper");

  background(220);
  colorMode(HSB);
}

function draw() {
  // background(220);
  translate(width/2,height/2);
  for(let i = 0; i < 10; i++) {
      stroke(10*angle % 360,100,100);
      fill(10*angle % 360,100,100)

    circle(190*cos(7*angle),(10*angle % 200)*sin(12*angle),5);
    angle += 0.001;
  }
}
