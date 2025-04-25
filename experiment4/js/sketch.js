var s = function (p) {
  var x = 100;
  var y = 100;

  p.setup = function () {
    p.createCanvas(800, 600);
  };

  p.draw = function () {
    p.background(0);
    p.fill(255);
    p.rect(x, y, 50, 50);
    x--;
  };
};

var myp5_1 = new p5(s, "canvas-container");
