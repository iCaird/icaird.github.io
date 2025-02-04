class Rim {
    constructor(label,n) {
        this.n=n;
        this.k = label.length;
        this.label = label;
        this.stepDirs = this.makeStepDirs(label);
    }


    makeStepDirs(l){
        //downsteps are encoded with a 1, makes sense with y coordinate stuff
        let stepDirs = [];
        for(let i = 1; i <= this.n; i++){
            if(l.includes(i)){
                stepDirs.push(1);
            }else {
                stepDirs.push(-1);
            }
        }
        return stepDirs;
    }

    show(sx,sy,w,h){
        let curX = sx;
        let curY = sy;
        for(let i = 0; i < this.n; i++){
            let nextX = curX + w;
            let nextY = curY + h*this.stepDirs[i];
            line(curX,curY,nextX,nextY);
            circle(curX,curY,10);
            curX = nextX;
            curY = nextY;
        }
        circle(curX,curY,10);
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
}
