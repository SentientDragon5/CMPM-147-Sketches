/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */

function getInspirations() {
  return [
    {
      name: "Earthrise",
      assetUrl: "img/earthrise.jpg",
      credit: "Earthrise, NASA, 1968",
    },
    {
      name: "Black Hole",
      assetUrl: "img/blackHole.jpg",
      credit: "Sagittarius A*, NASA Event Horizon Telescope, 2022",
    },
    {
      name: "2001",
      assetUrl: "img/2001.jpg",
      credit: "2001: A Space Odyessy, Stanley Kubrick, 1968",
    },
  ];
}

// this is the factor by which the scale sis applied
const SCALE_FACTOR = 400;
// count of particles
const COUNT = 4500;
// This is the width/height divisor ratio of the radius of the dots
const R_DIV = 70;

function initDesign(inspiration) {
  const SCALE = 1; //SCALE_FACTOR / inspiration.image.width;
  let canvasContainer = $(".image-container"); // Select the container using jQuery
  let canvasWidth = canvasContainer.width(); // Get the width of the container
  let aspectRatio = inspiration.image.height / inspiration.image.width;
  let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
  resizeCanvas(canvasWidth * SCALE, canvasHeight * SCALE);
  $(".caption").text(inspiration.credit); // Set the caption text

  // add the original image to #original
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${
    canvasWidth * SCALE
  }px;">`;
  $("#original").empty();
  $("#original").append(imgHTML);

  let design = {
    bg: 0, // start with black
    fg: [],
  };

  for (let i = 0; i < COUNT; i++) {
    let box = {
      x: random(width),
      y: random(height),
      w: random(width / R_DIV),
      h: random(height / R_DIV),
    };

    const fill = getImgColor(inspiration, box);
    design.fg.push({
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      r: fill.r,
      g: fill.g,
      b: fill.b,
    });
  }
  return design;
}

function getImgColor(inspiration, box) {
  let img = inspiration.image;
  const SCALE = 1; //SCALE_FACTOR / inspiration.image.width;
  img.loadPixels();

  // initialize color
  let c = { r: 0, g: 0, b: 0 };

  for (let y = floor(box.y / SCALE); y < floor((box.y + box.h) / SCALE); y++) {
    for (
      let x = floor(box.x / SCALE);
      x < floor((box.x + box.w) / SCALE);
      x++
    ) {
      // add colors to get total color for the box
      const i = (y * img.width + x) * 4; // 4 is number of channels
      c.r += img.pixels[i + 0]; // red channel
      c.g += img.pixels[i + 1]; // green channel
      c.b += img.pixels[i + 2]; // blue channel
    }
  }

  // average by dividing by the count of pixels in box
  // this makes c the average color
  const count = box.w * box.h;
  c.r /= count;
  c.g /= count;
  c.b /= count;

  return c;
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();
  for (let box of design.fg) {
    fill(box.r, box.g, box.b, 128);
    ellipse(box.x, box.y, box.w, box.w);
  }
}

const MAX_COLOR_CHANGE = 15;
const MAX_POSITION_CHANGE = 7;
const COLOR_CHANGE_RATE = 80;

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);

  for (let box of design.fg) {
    let c = {
      r: box.r,
      g: box.g,
      b: box.b,
    };

    console.log(Math.floor(millis % COLOR_CHANGE_RATE));
    if (Math.floor(millis % COLOR_CHANGE_RATE) == 0) {
      c = getImgColor(inspiration, box);
    }

    let max_c = MAX_COLOR_CHANGE;
    let max_r = MAX_POSITION_CHANGE;

    box.x = mut_dist(box.x, max_r, rate);
    box.y = mut_dist(box.y, max_r, rate);
    box.w = mut_dist(box.w, max_r, rate);
    box.h = mut_dist(box.h, max_r, rate);

    box.r = mut_dist(box.r, max_c, rate);
    box.g = mut_dist(box.g, max_c, rate);
    box.b = mut_dist(box.b, max_c, rate);
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}

function mut_dist(num, dist, rate) {
  return mut(num, num - dist, num + dist, rate);
}
