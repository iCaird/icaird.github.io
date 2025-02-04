let kDropDown;
let sytButton;
let ssytButton;
let weightEntry;
let ncmButton;
let pluckerPairButton;
let showMatchings = false,
	showTypes = false;
let matchings = [];
let allkTypes;
let k = 3;
let scal = 1;
let offset;
let syt;
let types = [];
let displayTypes;
let sortDiv;
let deleteMe;
let popUp;

let sortLexButton, sortMatchButton, sortExtButton, sortTopButton;
let exportTestButton;

let catalans = [
	1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, 16796, 58786, 208012, 742900,
	2674440, 9694845, 35357670, 129644790, 477638700, 1767263190, 6564120420,
	24466267020, 91482563640, 343059613650, 1289904147324, 4861946401452,
	18367353072152, 69533550916004, 263747951750360, 1002242216651368,
	3814986502092304,
];

let mcolors = [];
let rim;
function setup() {
	createCanvas(window.innerWidth,window.innerHeight-60);
	initialiseInput();
	// exportTest();

	//mouse and zoom with mouse, copied from somewhere
	offset = createVector(0, 0);

	canvas.addEventListener("wheel", (e) => {
		e.preventDefault();
		const s = 1 - e.deltaY / 500;
		scal *= s;
		const mouse = createVector(mouseX, mouseY);

		offset.sub(mouse).mult(s).add(mouse);
	},{passive: false});


}

function draw() {
	
	noFill();
	background(180);
	//line(0,height/2,width,height/2);
	//line(width/2,0,width/2,height);

	translate(offset.x, offset.y);
	scale(scal);
	
	
	//rect(0, 0, width, height); //bounding rectangle
	textSize(32);
	if (mouseIsPressed && mouseY < height) {
		offset.x -= pmouseX - mouseX;
		offset.y -= pmouseY - mouseY;
	}

	//TODO: surely a better way to toggle showing these things than this
	if (showMatchings) {
		drawMatchings();
	}

	if (showTypes) {
		makeTypes();
	}

	if (displayTypes && types.length != 0) {
		for (let type of types) {
			type.show();
		}
		let left = types[0];
		push();
		textAlign(CENTER,CENTER);
		textFont("Courier New");
		fill(0);
		stroke(0);
		text("m",left.x-2*left.r,left.y + 2*left.r);
		text("d",left.x-2*left.r,left.y + 3*left.r);
		text("t",left.x-2*left.r, left.y + 4*left.r);

		let right = types.at(-1);
		text("m",right.x+2*right.r,right.y + 2*right.r);
		text("d",right.x+2*right.r,right.y + 3*right.r);
		text("t",right.x+2*right.r, right.y + 4*right.r);
		pop();
	}

}

function initialiseInput() {
	//maybe this should be slider instead
	kDropDown = createSelect();

	for (let i = 2; i < 21; i++) {
		kDropDown.option(i);
	}
	kDropDown.selected(3);
	kDropDown.changed(() => {
		k = kDropDown.value();
		getMatchings();
		getMatchings();
		getTypes();
	});
	kDropDown.style('font-family','Courier New')

	//this button is auto called by matchings button and that is almost
  //surely a bad thing
	sytButton = createButton("Generate SYT");
	sytButton.mouseClicked(getSYT);

	ssytButton = createButton("Generate SSYT");

	weightEntry = createInput("Enter weight");
	weightEntry.elt.addEventListener("focus", () => {
		weightEntry.elt.select();
	});
	weightEntry.style('font-family','Courier New')

	ncmButton = createButton("Matchings");
	ncmButton.mouseClicked(getMatchings);

	pluckerPairButton = createButton("Plucker pair types");
	pluckerPairButton.mouseClicked(getTypes);

	jumpLeftButton = createButton("Jump to left end");
	jumpLeftButton.mouseClicked(() => {
		jump(0);
	});

	jumpRightButton = createButton("Jump to right end");
	jumpRightButton.mouseClicked(() => {
		jump(1);
	});

	sortDiv = createDiv("Sort: ");
	sortDiv.position(0,height+30);

	sortLexButton = createButton('Lex').mouseClicked(() => sortTypes("lexIndex"));
	sortMatchButton = createButton('Match').mouseClicked(() => sortTypes("numCompMatchings"));
	sortExtButton = createButton('Ext').mouseClicked(() => sortTypes("extDim"));
	sortTopButton = createButton('Top').mouseClicked(() => sortTypes("tops"));

	sortDiv.child(sortLexButton);
	sortDiv.child(sortMatchButton);
	sortDiv.child(sortExtButton);
	sortDiv.child(sortTopButton);

	for(let dom of [...document.getElementsByTagName("Button")]){
		console.log(dom);
		dom.style.fontFamily = "Courier New";
	}

	let y = window.outerHeight/2 + window.screenY - 200;
	let x = window.outerWidth/2 + window.screenX - 200;
	deleteMe = createButton("Open window:").mouseClicked(() => window.open("https://icaird.github.io/R1M2/index.html","test",`location=no,titlebar=no,toolbar=no,popup=true,height=400,width=400,left=${x},top=${y}`));

	//initialise exportTest button
	// exportTestButton = createButton("Export test");
	//run exportTest function when clicked
	// exportTestButton.mouseClicked(exportTestFunction);



}

function getSYT() {
	//TODO: I shouldnt be generating these each time, I should go it once and then store in JSON file
	let arr = Array.from(Array(2 * k).keys()).map((e) => e + 1);
	let tabs = makeTableaux(k, arr).map((ar) => ar.map((e) => e + 1));
	tabs = tabs.map((tab) => {
		return [
			tab.filter((e, i) => i % 2 == 0),
			tab.filter((e, i) => i % 2 == 1),
		];
	});
	syt = tabs;
}

function getMatchings() {
	
	displayTypes = false;
	// TODO: logic here should be improved too, if already have matchings for this k then i shouldnt generate them again
	if (matchings || !syt) {
		//either SYT need generating or I need to override current matchings
		matchings = [];
		getSYT();
	}
	
	mcolors = [];
	for (let tab of syt) {
		matchings.push(matchingFromTableux(tab));
		let r = random(100, 360);
		let g = random(50, 255);
		let b = random(20, 200);
		//b = 255;
		mcolors.push([r, g, b]);
	}
	
	showMatchings = !showMatchings;
	displayTypes = true;
}

function drawMatchings() {
	//TODO: these should probably be classes. Also maybe just use a double loop
	let matchNum = matchings.length;
	//console.log(`matchnum: ${matchNum}`);
	let area = (width * height) / matchNum;
	let circleDiam = sqrt((4 * area) / PI);
	//console.log(`area ${area}`);
	let numCols = width / circleDiam;
	//console.log(`numm mcols: ${numCols}`);
	for (let i = 0; i < matchings.length; i++) {
		let x = (i % ceil(numCols)) * circleDiam;
		let y = floor((i/numCols)) * circleDiam;
		push();
		translate(x,y)
		circle(0, 0, circleDiam);
		fill(0);
		text(i,0,0);
		for (let match of matchings[i]) {
			let x1 =
				
				(circleDiam / 2) *
					cos(((match[0] - 1) * TWO_PI) / (2 * k) - PI / 2);
			let y1 =
				
				(circleDiam / 2) *
					sin(((match[0] - 1) * TWO_PI) / (2 * k) - PI / 2);
			let x2 =
				
				(circleDiam / 2) *
					cos(((match[1] - 1) * TWO_PI) / (2 * k) - PI / 2);
			let y2 =
				
				(circleDiam / 2) *
					sin(((match[1] - 1) * TWO_PI) / (2 * k) - PI / 2);
			
			noFill();
			// let xcontrol = (x1 + x2) / 2;
			// let ycontrol = (y1 + y2) / 2;
			// curve(xcontrol, ycontrol, x2, y2, x1, y1, xcontrol, ycontrol);
			let ap1 = createVector(x1, y1);
			let ap2 = createVector(x2, y2);
			let aux = createVector((x1 + x2) / 2, (y1 + y2) / 2);
			aux.mult(0.5);
			let cp1 = ap1.copy();
			cp1.sub(aux);
			let cp2 = ap2.copy();
			cp2.sub(aux);

			bezier(ap1.x, ap1.y, cp1.x, cp1.y, cp2.x, cp2.y, ap2.x, ap2.y);
			
		}
		pop();
	}
}

function getTypes() {
	if (!allkTypes) {
		// fetch("./dihedralBinaryRepsTo12.json")
		fetch("./dihedralBinaryRepsTo12.json")
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! Status: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				allkTypes = data;
			});
	}

	showTypes = true;
}

function makeTypes() {
	// ! some async shenanigans were happening with file fetch i think, sloppy fix
	if (!allkTypes) {
		return;
	}
	let currentTypes = allkTypes[k].reverse();
	types = [];
	for (let i = 0; i < currentTypes.length; i++) {
		let currentType = currentTypes[i];

		push();
		let x = i * 70 + width / 2 - (currentTypes.length / 2) * 70;
		let y = height/2;
		//25 is radius
		// if(!(-offset.x/scal < (x+25) && x-25 < (width-offset.x)/scal) || !(-offset.y/scal < y+25 && y-25 < (height-offset.y)/scal)){
		// 	continue;
		// }
		//TODO: have to rethink the above rendering trick if the pairs are now classes, should move this to the actual class

		let p = new PluckerPairType(currentType, x, y, 30);
		p.calculateCompMatchings(matchings);
		types.push(p);
		p.lexIndex = i;

		
		// translate(x, y);
		// circle(0, 0, 50);
		// for (let r = 0; r < 2 * k; r++) {
		// 	let cx = 25 * cos((r * TWO_PI) / (2 * k) - PI / 2);
		// 	let cy = 25 * sin((r * TWO_PI) / (2 * k) - PI / 2);
		// 	if (currentType[0].includes(r + 1)) {
		// 		fill(0, 255, 0);
		// 	} else {
		// 		fill(255, 0, 0);
		// 	}

		// 	//let numCompMatchings = getCompMatchings(currentType);
		// 	//text(r,cx,cy);
		// 	circle(cx, cy, 10);
		// }
		pop();
	}
	for(let i = 0; i < types.length; i++){
		for(let j = i+1; j < types.length; j++){
			console.log(i,j);
			let first = types[i];
			let second = types[j];
			console.log(JSON.stringify(first.type));
			console.log(JSON.stringify(second.type));
			let firstT = first.type[0];
			let secondT = second.type[1];
			if(firstT == secondT){
				console.log(`${firstT} and ${secondT} are paired!`)
				let c = color(random(255),random(255),random(255));
				first.colour = c;
				second.colour = c;
			}
		}
	}
	//! Trying to sort by tops, comment out
	
	showTypes = false;
	displayTypes = true;
}

function jump(d){
	if(types.length == 0){
		return;
	}
	if(!d){
		//left
		let left = types[0];
		let leftPos = createVector(left.x,left.y);
		scal = 1;
		offset.x = (-leftPos.x + width/(2));
		offset.y = (-leftPos.y + height/(2));
		//scal = temp;
		
	} else {
		//right
		let right = types.at(-1);
		let rightPos = createVector(right.x,right.y);
		scal = 1;
		offset.x = -rightPos.x + width/2;
		offset.y = -rightPos.y + height/2;
	}
	return;
}

function windowResized(){
	resizeCanvas(window.innerWidth,window.innerHeight-60)
}


function sortTypes(sortOrder){

	types.sort((e,f) =>{
		return e[sortOrder] - f[sortOrder];
	});
	for(let type of types){
		let x = types.indexOf(type) * 70 + width / 2 - (types.length / 2) * 70;
		let y = height/2;
		console.log(x,y);
		type.x = x;
		type.y = y;
	}
}

// function exportTestFunction(){
// 	console.log("here");
// 	let a = document.createElement("a");
// 	a.href = URL.createObjectURL(new Blob([JSON.stringify(catalans)],{type: 'application/json'}));
// 	a.download = "catalans.json";
// 	a.click();
// }
//
// function testFunction(){
// 	console.log("test");
// }


