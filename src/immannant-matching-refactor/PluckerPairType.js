class PluckerPairType {
	constructor(type, x, y, r) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.r = r;
		this.k = type[0].length;
		this.matchingColours = [];
		this.extDim = this.getExt(this.type[0], this.k);
		this.tops = this.calcTops();
		this.colour = color(0,0,0);
		this.rimToggle = false;
		this.capture = false;
	}

	show() {
		if (
			!(
				-offset.x / scal < this.x + this.r &&
				this.x - this.r < (width - offset.x) / scal
			)
		) {
			//console.log(`${types.indexOf(this)} is hidden!`)
			return;
		}
		this.checkClicked();
		push();
		strokeWeight(2);
		circle(this.x, this.y, 2 * this.r);
		this.drawCompMatchings();

		this.smallCircles();
		pop();
		// push();
		// strokeWeight(10);
		// line(this.x,this.y-this.r,this.x, this.y -this.r- 20*this.numCompMatchings);
		// pop();
		push();
		fill(0);
		if (
			this.numCompMatchings <= catalans[this.extDim]
			
		) {
			fill(255, 0, 0);
		}
		if(this.numCompMatchings > catalans[this.extDim + 1]){
			fill(0,0,255);
		}
		textFont("Courier New");
		textStyle(BOLD);
		strokeWeight(4);
		textSize(28);
		textAlign(CENTER, CENTER);
		text(this.numCompMatchings, this.x, this.y + 2*this.r);
		text(this.extDim, this.x, this.y + 3*this.r);
		text(this.tops,this.x,this.y + 4*this.r);
		pop();

		if(this.rimToggle){
			this.showRim();
		}
	}

	smallCircles() {
		for (let i = 0; i < 2 * this.k; i++) {
			push();
			let cx =
				this.x + this.r * cos((i * TWO_PI) / (2 * this.k) - PI / 2);
			let cy =
				this.y + this.r * sin((i * TWO_PI) / (2 * this.k) - PI / 2);
			if (this.type[0].includes(i + 1)) {
				fill(0, 255, 0);
			} else {
				fill(255, 0, 0);
			}
			circle(cx, cy, (this.r * PI * 2) / (4 * this.k));
			pop();
		}
	}

	calculateCompMatchings(matchings) {
		let compMatchings = [];
		let I = this.type[0];
		let J = this.type[1];

		for (let matching of matchings) {
			let comp = true;
			for (let match of matching) {
				if (
					!(
						(I.includes(match[0]) && J.includes(match[1])) ||
						(J.includes(match[0]) && I.includes(match[1]))
					)
				) {
					comp = false;
					break;
				}
			}
			if (comp) {
				compMatchings.push(matching);
				let red = random(255);
				let green = random(255);
				let blue = random(255);
				this.matchingColours.push([red, green, blue]);
			}
		}

		this.compMatchings = compMatchings;
		this.numCompMatchings = compMatchings.length;

		//console.log(this.compMatchings);
	}

	drawCompMatchings() {
		//console.log(this.matchingColours);
		let count = 0;
		
		for (let matching of this.compMatchings) {
			if (
				!(
					-offset.y / scal < (-count-1)*2.5*this.r + this.y + this.r &&
					(-count-1)*4.5*this.r + this.y + this.r < (height - offset.y) / scal
				)
			){	
				//console.log(`Necklace ${types.indexOf(this)} matching ${count} is hidden!`)
				count++;
				continue;
			}
			push();
			translate(this.x, (-count-1)*2.5*this.r + this.y);
			//console.log(this.compMatchings.indexOf(matching));
			let colour = mcolors[matchings.indexOf(matching)];
			// console.log(`COLOUR: ${colour}`);
			let r = colour[0];
			let g = colour[1];
			let b = colour[2];
			colorMode(HSB);
			stroke(r, g, b);
			strokeWeight(4);
			for (let match of matching) {
				let x1 =
					this.r *
					cos(((match[0] - 1) * TWO_PI) / (2 * this.k) - PI / 2);
				let y1 =
					this.r *
					sin(((match[0] - 1) * TWO_PI) / (2 * this.k) - PI / 2);
				let x2 =
					this.r *
					cos(((match[1] - 1) * TWO_PI) / (2 * this.k) - PI / 2);
				let y2 =
					this.r *
					sin(((match[1] - 1) * TWO_PI) / (2 * this.k) - PI / 2);
				//line(x1, y1, x2, y2);
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
			count++;
			pop();
		}
	}

	getExt(J, k) {
		const edgeData = [];
		let tracker = 0;
		for (let i = 1; i <= 2 * k; i++) {
			let newTracker;
			if (J.includes(i)) {
				newTracker = tracker - 1;
			} else {
				newTracker = tracker + 1;
			}
			edgeData.push(Math.min(tracker, newTracker));
			tracker = newTracker;
		}
		const counter = {};

		edgeData.forEach((e) => {
			if (counter[e]) {
				counter[e] += 1;
			} else {
				counter[e] = 1;
			}
		});

		let ext = 0;
		for (let key of Object.keys(counter)) {
			ext += counter[key] / 2 - 1;
		}

		return ext;
	}

	calcTops(){
		let green = true;
		let tops = 1;
		for(let i = 1; i <= 2*this.k; i++){
			if(this.type[1].includes(i) && green){
				green = false;
				tops++;
				continue;
			}
			if(this.type[0].includes(i) && !green){
				green = true;
				tops++;
				continue;
			}
		}
		return tops/2;
	}

	

	checkClicked(){
		//detecting if mouse has been unclicked
		if(!(this.capture == true && mouseIsPressed == false)){
			this.capture = mouseIsPressed;
			return
		}
		this.capture = mouseIsPressed;

		
		if(((mouseX-offset.x)/scal-this.x)**2 + ((mouseY-offset.y)/scal-this.y)**2 <= this.r**2){
			console.log("IVE BEEN CLICKED");
			let temp = this.type[0];
				if(!this.rim){
					this.rim = new Rim(this.type[0],2*this.k);
					console.log(`Sending: ${this.type[0].join} and ${2*this.k}`);
					
					console.log(temp);
					console.log(temp.join(""));
				}
				if(!popUp){
					console.log("NO POP UP SO MAKING!");
					popUp = window.open(`popUp.html?label=${temp.join(",")}&n=${2*this.k}`,`${temp.join("")}`,"popup=true,width=800,height=400");
				} else {
					console.log(popUp);
					console.log("trying to set params");
					let params = new URLSearchParams(popUp.location.search);
					console.log(`Trying to change label to: ${temp.join(",")}`);
					params.set("label",temp.join(","));
					params.set("n",2*this.k);
					console.log(params.toString());
					popUp.location.search = params.toString();
					//popUp.location.reload();
				}
			
				//this.rimToggle = !this.rimToggle;
			}
	}

	showRim(){
		this.rim.show(this.x,this.y,50,50);
	}
}
