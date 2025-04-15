let color_bottom;
let color_top;

let bubbles = [];
const bubble_count = 20;

class Bubble{
  constructor(x,y,r){
    this.x = x || random(width)
    this.y = y || random(height, height + 100)
    this.r = r || random(5,30)
    this.y_vel = random(1,3)
  }
  move(){
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
  
  for(let i=0;i<bubble_count;i++){
    bubbles.push(new Bubble());
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
    bubbles[i].move();
    bubbles[i].display();
    
    if(bubbles[i].offscreen()){
      bubbles.splice(i,1);
    }
  }
}