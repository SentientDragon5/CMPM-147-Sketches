var s = function (p) {
  let seed = 0;

  let tile_pad = 1;
  let view_cols = 40;
  let view_rows = 40;
  let tile_size = 16;

  let noise_scale = 1/12;

  let camera_offset;
  let camera_velocity;
  let camera_speed = 0.5;

  p.setup = function () {
    p.createCanvas(view_cols * tile_size, view_rows * tile_size);
    
    p.select("#reseedButton").mousePressed(p.reseed);
    p.reseed();

    camera_offset = new p5.Vector(p.width / 2, p.height / 2);
    camera_velocity = new p5.Vector(0, 0);
  };

  p.draw = function () {
    p.updateCameraPosition();
    p.background(120);
    p.fill(255);
    p.rect(100 + camera_offset.x, 100 + camera_offset.y, 50, 50);
    p.drawTilemap();
    
    p.fill(255);
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

  p.drawTilemap = function() {
    p.background(100);
    
    for (let i = 0 - tile_pad; i < view_rows + tile_pad; i++) {
      for (let j = 0 - tile_pad; j < view_cols + tile_pad; j++) {
        let w_x = i * tile_size + camera_offset.x;
        let w_y = j * tile_size + camera_offset.y;
        let s_x = i * tile_size + w_x % tile_size;
        let s_y = j * tile_size + w_y % tile_size;
        let n_x = i * noise_scale + camera_offset.x / tile_size;
        let n_y = j * noise_scale + camera_offset.y / tile_size;

        let n = p.noise(n_x, n_y);
        p.fill(n * 255);
        p.rect(s_x, s_y, tile_size, tile_size);
      }
    }
  }

  
  p.reseed = function () {
    seed = (seed | 0) + 1109;
    p.randomSeed(seed);
    p.noiseSeed(seed);
    p.select("#seedReport").html("seed " + seed);
  };
};

var myp5_1 = new p5(s, "canvas-container");
