var s = function (p) {

  let camera_offset;
  let camera_velocity;
  let camera_speed = -0.5;

  p.setup = function () {
    p.createCanvas(800, 600);
    camera_offset = new p5.Vector(p.width / 2, p.height / 2);
    camera_velocity = new p5.Vector(0, 0);
  };

  p.draw = function () {
    p.updateCameraPosition();
    p.background(120);
    p.fill(255);
    p.rect(100 + camera_offset.x, 100 + camera_offset.y, 50, 50);
    p.text("position: " + p.round(camera_offset.x) + " " + p.round(camera_offset.y), 50,50);
  };

  p.updateCameraPosition = function () {
    if (p.keyIsDown(p.LEFT_ARROW)) {
      camera_velocity.x -= camera_speed;
    }
    if (p.keyIsDown(p.RIGHT_ARROW)) {
      camera_velocity.x += camera_speed;
    }
    if (p.keyIsDown(p.DOWN_ARROW)) {
      camera_velocity.y += camera_speed;
    }
    if (p.keyIsDown(p.UP_ARROW)) {
      camera_velocity.y -= camera_speed;
    }
    let camera_delta = new p5.Vector(0, 0);
    camera_velocity.add(camera_delta);
    camera_offset.add(camera_velocity);
    camera_velocity.mult(0.95);
    if (camera_velocity.mag() < 0.01) {
      camera_velocity.setMag(0);
    }
  };
};

var myp5_1 = new p5(s, "canvas-container");
