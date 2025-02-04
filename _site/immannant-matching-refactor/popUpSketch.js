let rim;
let label;
let n;
let cols;
let colWidth;
let rows;
let rowHeight;
let colour,colour2;
let rimComp; //i should perhaps implement this instead as a method or a Rim

let sx,sy; //start locations for rim
let csx;
let csy;
function setup(){
    let h = random(360);
    colour = [h,100,100];
    h = random(360);
    colour2 = [h,100,100];

    createCanvas(window.innerWidth,window.innerHeight);

    const urlParams = new URLSearchParams(window.location.search);
    for (const p of urlParams){
        console.log(p);
    }
    
    label = urlParams.get("label");
    n = urlParams.get("n");
    document.title = label;
    arrLabel = label.split(",").map((e) => parseInt(e));
    n = parseInt(n);
    rim = new Rim(arrLabel,n);

    rowsCols();

    
}



function draw(){
    background(0);
    push();
    colorMode(HSB);
    strokeWeight(4);
    stroke(colour);
    fill(colour);
    rim.show(sx,sy,colWidth,rowHeight);
    if(rimComp){
        push();
        fill(colour2);
        stroke(colour2);
        rimComp.show(csx,csy,colWidth,rowHeight);
        pop();
    }
    pop();

    if(keyIsDown(67) && keyIsDown(16)){
        rotateLabel(1);
    }
}


function keyPressed(){

    if(key == "c"){
        console.log(key);
        rotateLabel(1);
    }
    if(key == "x"){
        rotateLabel(-1);
    }

    if(key == "m"){
        let en = [...Array(n).keys()].map(e => { return e+1});
        let labelComp = en.filter(e => !arrLabel.includes(e));
        console.log(labelComp);
        csx = sx;
        csy = sy;
        rimComp = new Rim(labelComp,n);
    }

    if(keyCode == DOWN_ARROW){
        csy += 2*rowHeight;
        console.log("HERE");
    }

    if(keyCode == UP_ARROW){
        csy -= 2*rowHeight;
    }
    
}

function rotateLabel(dir){
    console.log("ayo rotating");
    console.log(arrLabel);
    
    let temp = rim.stepDirs;
    // if(temp[temp.length-1] == 1){
    //     sy -= rowHeight;
    // } else {
    //     sy += rowHeight;
    // }
    console.log(temp);  
    if(dir == 1){
        sy += -temp[temp.length-1]*rowHeight;
        csy -= -temp[temp.length-1]*rowHeight;
    } else {
        sy += temp[0]*rowHeight;
        csy -= -temp[temp.length-1]*rowHeight;
    }
    
    arrLabel = arrLabel.map((e) => {
        if((e+dir) % n == 0){
            return n;
        } else {
            return (e+dir) % n; 
        }
    });
    //make this a rim.updateDirs function maybe
    rim.label = arrLabel;
    rim.stepDirs = rim.makeStepDirs(arrLabel);
    let en = [...Array(n).keys()].map(e => { return e+1});
    let labelComp = en.filter(e => !arrLabel.includes(e));
    rimComp.label = labelComp;
    rimComp.stepDirs = rimComp.makeStepDirs(labelComp);
    console.log(arrLabel);
    console.log(`Current StepDirs: ${rim.stepDirs}`);
    document.title = arrLabel.sort((a,b) => a-b).join(" ");
}

function myMod(a,n){
    return ((a % n) + n) % n;
}


function rowsCols(){
    cols = parseInt(n)+2;
    colWidth = width/cols;
    

    let temp = rim.makeAbsolute();
    rows = abs(max(temp)-min(temp)) + 2;
    rowHeight = height/rows;

    sx = colWidth;
    sy = rowHeight;
}

function windowResized(){
    resizeCanvas(window.innerWidth, window.innerHeight);
    rowsCols();
}
