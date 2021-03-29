let STEP = 1;
let STEP2 = 6;
let FAT = 3;
let DISTORTION;
let DIST; //widness of the gate
let OPA = 8;
let NBSHAPES = 11;

const R = 233;
const G = 255;
const B = 242;

let NOISE;
let FACTREDUX = 0.1; //0.2
let FACTREDUX2 = 0.03; //0.03
let TAIL1 = 15; //10
let TAIL2 = 50; //19 //weird warp
let OFF1; //offsets prob
let OFF2;

let val,t;
let shapeTab = [];

let test = 0;
let cpt = 1;
let c;

function setup() {
  c = createCanvas(1920, 1080);
  background(0);
  initTab();
}

function draw() {
  if(test == 0) updateTab();
  else saveOutput();
}

/*--------------------------------------------------------*/

function initTab(){
  t = random(1000);
  NOISE = random(0.15,0.85);
  OFF1 = random(0.5,0.9);
  OFF2 = random(0.2,0.4);
  DIST = random(200,4300);
  TAIL = random(5,18);
  TAIL2 = random(20,80);

  if(random(1)>0.6) DISTORTION = Math.floor(random(2,8));
  else DISTORTION = 1;

  for(i=0;i<NBSHAPES;i++){
    if(random()>random(0.3,0.9)) shapeTab[i] = new Shape(createVector(50,height/2),createVector(width-50,height/2),Math.round(random(1,4))*50,NOISE,0);
    else 
    shapeTab[i] = new Shape(createVector(50,height/2),createVector(width-50,height/2),Math.round(random(1,7))*50,NOISE,Math.floor(random(1,3)));
  }
}

function updateTab(){
  
  //console.log(shapeTab);
  for(i=0;i<NBSHAPES;i++){
    shapeTab[i].drawShape();
  }
  //test = 1; //
}

function saveOutput() {

  //saveCanvas(c,`SERIE4C_saveFrame${cpt}`, 'jpg');
  //console.log("oui");
  background(0);

  test = 0;

  NBSHAPES += Math.round(random(-NBSHAPES*0.5,NBSHAPES*0.5));
  if(NBSHAPES >= 200) NBSHAPES /= 2;
  if(NBSHAPES <= 2) NBSHAPES *= 5;
  console.log(NBSHAPES);  

  initTab();
  
  cpt++;
}

function keyPressed() {
  if(key = 'r') test = 1;
}

/*--------------------------------------------------------*/

class Shape{

  constructor(start,end,amp,ratio,type){
    this.start = createVector(start.x,start.y);
    this.end = createVector(end.x,end.y);
    this.amp = amp;
    this.ratio = ratio;
    this.pos = start;
    this.type = type; //0 means flat, 1&2 means modified
    //console.log(random(1));
    this.trans = 0;
    if(random(1) < OFF1) this.trans = random(start.x + 100, end.x-end.x*FACTREDUX*2);
    if(random(1) < OFF2) this.trans =  end.x-end.x*FACTREDUX-50;
    
  }

  drawShape(){
    while(this.pos.x <= this.end.x){
      if (this.type == 0) this.drawStep();
      else this.drawStepBis();
      this.pos.x += STEP;
      t+=0.01;
    }
  }


  drawStep(){

    fill(R,G,B,OPA);
    noStroke();

    val = noise(t*this.ratio);
    val = map(val,0,1,this.start.y-DIST,this.start.y+2*this.amp+DIST);
    this.pos.y = val;

    if (this.pos.y < this.start.y) this.pos.y = this.start.y;
    if(this.pos.y > this.start.y+this.amp) this.pos.y = this.start.y+this.amp;

    this.pos.x += random(-DISTORTION,DISTORTION)*noise(this.pos.x);
    this.pos.y += random(-DISTORTION,DISTORTION)*noise(this.pos.y);
    
    //console.log(this.pos);
    //ellipse(this.pos.x,this.pos.y,FAT);
    ellipse(this.pos.x,height-this.pos.y-this.amp + this.amp+80,FAT);
    let i = 1;

    while(this.pos.y-i >= this.start.y - this.amp/2){
      //if (i>60) ellipse(this.pos.x,this.pos.y-(i*i)/100,FAT);
      ellipse(this.pos.x,height-this.pos.y-this.amp+(i*i*TAIL1)/(TAIL2*this.amp) + this.amp+80,FAT);
      i+=STEP2;
    }

  }

  drawStepBis(){

    fill(R,G,B,OPA);
    noStroke();

    val = noise(t*this.ratio);
    val = map(val,0,1,this.start.y-DIST,this.start.y+2*this.amp+DIST);
    this.pos.y = val;

    if (this.pos.y < this.start.y) this.pos.y = this.start.y;
    if(this.pos.y > this.start.y+this.amp) this.pos.y = this.start.y+this.amp;

    this.pos.x += random(-DISTORTION,DISTORTION);
    this.pos.y += random(-DISTORTION,DISTORTION);

    //console.log(this.pos);
    //ellipse(this.pos.x,this.pos.y,FAT);
    //console.log (this.trans);
    let tempX = this.start.x + this.pos.x*FACTREDUX + this.trans;
    let tempY = (height-this.pos.y+80);

    if(tempY > this.start.y) ellipse(tempX,tempY + this.pos.x*FACTREDUX2,FAT);
    else ellipse(tempX,tempY - this.pos.x*FACTREDUX2 + this.amp/2,FAT);

    let i = 1;

    while(this.pos.y-i >= this.start.y - this.amp/2){
      //if (i>60) ellipse(this.pos.x,this.pos.y-(i*i)/100,FAT);
      if(tempY > this.start.y) ellipse(tempX,(tempY+(i*i*TAIL1)/(TAIL2*this.amp)) + this.pos.x*FACTREDUX2,FAT);
      else ellipse(tempX,(tempY+(i*i*TAIL1)/(TAIL2*this.amp)) - this.pos.x*FACTREDUX2,FAT);
      i+=STEP2;
    }
  }
}