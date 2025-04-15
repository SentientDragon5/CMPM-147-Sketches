let color_bottom;
let color_top;

let bubbles = [];
let bubble_count = 20;

let kelp_plural = []
let kelp_count = 5;

class Kelp {
  constructor(x){
    this.x = x;
    this.segments = random(20,30);
    this.maxHeight = random(height*0.5,height*0.8);
    this.segLen = this.maxHeight / this.segments
    this.c = color(10, random(100, 160), random(50, 80), 180);
    this.thickness = random(8, 20);
    this.waveFreq = random(0.005,0.01);
    this.waveAmp = random(15,30)
    this.noiseOffset = random(100);
  }
  display(){
    push();
    noFill();
    stroke(this.c);
    strokeWeight(this.thickness);
    strokeCap(ROUND);
    beginShape();
    curveVertex(this.x, height);
    curveVertex(this.x, height);
    for(let i=1; i<=this.segments; i++){
      let y = height - i * this.segLen;
      let n = noise(this.noiseOffset + frameCount * this.waveFreq, i*0.1);
      let xOff = map(n, 0, 1, -this.waveAmp, this.waveAmp);
      curveVertex(this.x+xOff, y);
    }
    let y = height - this.segments * this.segLen;
    let n = noise(this.noiseOffset + frameCount * this.waveFreq, this.segments*0.1);
    let xOff = map(n, 0, 1, -this.waveAmp, this.waveAmp);
    curveVertex(this.x+xOff, y);
    curveVertex(this.x+xOff, y);
    endShape();
    pop();
  }
}

class Bubble{
  constructor(x,y,r){
    this.x = x || random(width)
    this.y = y || random(height, height + 100)
    this.r = r || random(5,30)
    this.y_vel = random(1,3)
  }
  update(){
    this.y -= this.y_vel
  }
  display(){
    noStroke()
    fill(255,255,255,100)
    ellipse(this.x,this.y,this.r*2)
  }
  offscreen(){
    return this.y < -this.r
  }
}

function setup() {
  createCanvas(400, 400);
  
  color_bottom = color(24,26,87);
  color_top = color(108, 130, 230);
  
  bubble_count += random(5)
  kelp_count += random(2)
  
  for(let i=0;i<bubble_count;i++){
    bubbles.push(new Bubble());
  }
  
  for(let i=1;i<=kelp_count;i++){
    let x = i * width / (kelp_count -1)
    kelp_plural.push(new Kelp(x))
  }
}

function draw() {
  for(let y=0; y<height; y++){
    n = map(y,0,height,0,1);
    let bg_color = lerpColor(color_top,color_bottom,n);
    stroke(bg_color);
    line(0,y,width, y);
  }
  
  if(random(1) < 0.04){
    bubbles.push(new Bubble())
  }
  
  for(let i=bubbles.length-1;i>=0;i--){
    bubbles[i].update();
    bubbles[i].display();
    
    if(bubbles[i].offscreen()){
      bubbles.splice(i,1);
    }
  }
  
  for(let i=0;i<kelp_plural.length;i++){
    kelp_plural[i].display()
  }
}