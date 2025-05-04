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

function initDesign(inspiration) {
  const SCALE = 200 / inspiration.image.width;
  // set the canvas size based on the container
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
    bg: 0,
    fg: [],
  };

  for (let i = 0; i < 100; i++) {
    design.fg.push({
      x: random(width),
      y: random(height),
      w: random(width / 2),
      h: random(height / 2),
      fill: random(255),
    });
  }
  return design;
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();
  for (let box of design.fg) {
    fill(box.fill, 128);
    ellipse(box.x, box.y, box.w, box.h);
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for (let box of design.fg) {
    box.fill = mut(box.fill, 0, 255, rate);
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.w = mut(box.w, 0, width / 2, rate);
    box.h = mut(box.h, 0, height / 2, rate);
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}
