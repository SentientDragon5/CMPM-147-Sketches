var s = function (p) {
  let seed = 0;

  let tile_pad = 1;
  let view_cols = 80;
  let view_rows = 80;
  let tile_size = 8;

  let height_noise_scales = [1/12, 1/28, 1/50, 1/100, 1/200];
  let temperature_noise_scale = 1/50;
  let biome_noise_scale = 1/60;
  let water_noise_scale = 1/2;

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
    //p.text("position: " + p.round(camera_offset.x) + " " + p.round(camera_offset.y), 50,50);
    //p.text("t: " + p.millis(), 50, 100);
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
    let coldWater = new p5.Vector(66, 135, 245);
    let coldLowWater = new p5.Vector(54, 118, 186);
    let warmWater = new p5.Vector(55, 214, 219);
    let warmLowWater = new p5.Vector(44, 199, 160);
    let snowColor = new p5.Vector(228, 240, 247);
    let snowLowColor = new p5.Vector(217, 224, 242);
    let grassColor = new p5.Vector(109, 219, 90);
    let grassLowColor = new p5.Vector(69, 191, 85);
    let forestColor = new p5.Vector(37, 110, 73);
    let sandColor = new p5.Vector(235, 218, 160);
    let mountainColor = new p5.Vector(172, 170, 179);
    
    let grid = {};
    for (let i = 0 - tile_pad; i < view_rows + tile_pad; i++) {
      for (let j = 0 - tile_pad; j < view_cols + tile_pad; j++) {
        let w_x = camera_offset.x;
        let w_y = camera_offset.y;
        let s_x = i * tile_size; // + w_x % tile_size;
        let s_y = j * tile_size; // + w_y % tile_size;

        let h = 0;
        let samples = 4;
        for (let k=0; k<samples; k++){
          let k_n = p.sampleNoise(i, j, height_noise_scales[0]);
          h = h + (k_n -h)/(k+1);
        }
        
        let t_n = p.sampleNoise(i, j, temperature_noise_scale);
        let b_n = p.sampleNoise(i, j, biome_noise_scale);

        //let h = (h_n + b) / 2;
        grid[`${i},${j}`] = { // Use string keys
          height: h,
          temperature: t_n,
          biome: b_n,
        };
      }
    }

    for (let i = 0 - tile_pad; i < view_rows + tile_pad; i++) {
      for (let j = 0 - tile_pad; j < view_cols + tile_pad; j++) {
        let n = grid[`${i},${j}`]; // Access using string keys
        let h = n.height; // Current pixel height
        let t = n.temperature;
        let b = n.biome;
        // curvature
        let delta = 0;
        try {
          let neighbors = [
            grid[`${i - 1},${j}`]?.height || h, // Top
            grid[`${i + 1},${j}`]?.height || h, // Bottom
            grid[`${i},${j - 1}`]?.height || h, // Left
            grid[`${i},${j + 1}`]?.height || h, // Right
          ];

          delta = neighbors.reduce((sum, neighborHeight) => sum + Math.abs(h - neighborHeight), 0) / neighbors.length;
        } catch (e) {}

        let time = p.millis() /1000;
        let noise = p.sampleNoise(i + time, j + time, water_noise_scale);
        let water_noise = noise * noise * noise * 128;
        let color = new p5.Vector(0, 0, 0);
        if (h < 0.2) {
          if (t > 0.5){
            color = warmLowWater;
          } else {
            color = coldLowWater;
          }
          color = new p5.Vector(color.x + water_noise,color.y + water_noise, color.z + water_noise);
        } else if (h < 0.4) {
          if (t > 0.5){
            color = warmWater;
          } else {
            color = coldWater;
          }
          color = new p5.Vector(color.x + water_noise,color.y + water_noise, color.z + water_noise);
          
        } else if (t < 0.3 || h > 0.85) {
          if (h < 0.7){
            color = snowLowColor;
          } else {
          color = snowColor;
          }
        } else if ((h < 0.8 && h > 0.55) && (t < 0.55 && t > 0.4) && delta < 0.035){
          color = forestColor;
        } else if ((delta > 0.035 && h > 0.6) || h > 0.8 || b < 0.1) {
          color = mountainColor; 
        } else if (h < 0.5 || t > 0.9) {
          color = sandColor;
        } else if (h < 0.6 || t < 0.5) {
          color = grassLowColor;
        } else {
          color = grassColor;
        }
        //p.fill(h*255, delta * 10*255,0);
        p.fill(color.x, color.y, color.z);
        p.noStroke();
        p.rect(i * tile_size, j * tile_size, tile_size, tile_size);
      }
    }
  }

  // sample a 3 channel noise and get back an array of r g b 
  // values betwen 0 and 1
  p.sampleNoise = function(i, j, noise_scale){
    let n_x = (i + camera_offset.x / tile_size) * noise_scale;
    let n_y = (j + camera_offset.y / tile_size) * noise_scale;
    let n = p.noise(n_x, n_y);
    return n;
  }
  
  p.reseed = function () {
    seed = (seed | 0) + 1109;
    p.randomSeed(seed);
    p.noiseSeed(seed);
    p.select("#seedReport").html("seed " + seed);
  };
};

var myp5_1 = new p5(s, "canvas-container");
