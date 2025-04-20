/* exported generateGrid, drawGrid */
/* global placeTile */

const noiseScale = 1 / 12;

function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      let n = noise(i * noiseScale, j * noiseScale);
      if (round(n * 100 * 3) == 56 * 3) {
        row.push("h");
      } else if (n > 0.6) {
        row.push("t");
      } else if (n > 0.5) {
        row.push("_");
      } else {
        row.push("~");
      }
    }
    grid.push(row);
  }

  Snowflake.create(snowflakes, snowflake_count);
  return grid;
}

function drawGrid(grid) {
  background(128);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // Water under layer
      placeTile(i, j, random(4) | 0, 13);

      // place grass
      if (
        gridCheck(grid, i, j, "_") ||
        gridCheck(grid, i, j, "t") ||
        gridCheck(grid, i, j, "h")
      ) {
        placeTile(i, j, random(4) | 0, 12);
      } else {
        // place cliffs
        drawContext(grid, i, j, "_", 5, 0, snowyCliffsOverWater);
      }

      if (gridCheck(grid, i, j, "t")) {
        //placeTile(i,j, 22, 7)
        drawContext(grid, i, j, "t", 0, 0, snowytrees);
      }
      if (gridCheck(grid, i, j, "h")) {
        placeTile(i, j, 26 + (random(2) | 0), random(4) | 0);
      }

      let n = noise(i * noiseScale, j * noiseScale);
    }
  }

  Snowflake.update_arr(snowflakes);
  Snowflake.draw_arr(snowflakes);
}

function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
    return grid[i][j] == target;
  }

  return false;
}

function gridCode(grid, i, j, target) {
  const n = gridCheck(grid, i + 1, j, target);
  const s = gridCheck(grid, i - 1, j, target);
  const e = gridCheck(grid, i, j + 1, target);
  const w = gridCheck(grid, i, j - 1, target);
  return (n << 0) + (s << 1) + (w << 2) + (e << 3);
}

function drawContext(grid, i, j, target, dti, dtj, lookup) {
  const tileCode = gridCode(grid, i, j, target);
  const w = lookup[tileCode];
  if (tileCode != 0) {
    placeTile(i, j, w[0], w[1]);
  }
  //placeTile(i, j, dti, dtj);
}

const cliffsOverWater = [
  [1, 13], //surrounded
  [10, 2], //n
  [10, 0], //s
  [1, 13], //ns
  [9, 1], //e
  [9, 2], //ne
  [9, 0], //se
  [9, 1], //nse
  [11, 1], //w
  [13, 0], //nw
  [11, 0], //sw
  [11, 1], //nsw
  [1, 13], //ew
  [10, 2], //new
  [10, 0], //sew
  [1, 13], //single
];

const snowyCliffsOverWater = [
  [1, 13], //surrounded
  [10, 14], //n
  [10, 12], //s
  [1, 13], //ns
  [9, 13], //e
  [9, 14], //ne
  [9, 12], //se
  [9, 13], //nse
  [11, 13], //w
  [13, 12], //nw
  [11, 12], //sw
  [11, 13], //nsw
  [1, 13], //ew
  [10, 14], //new
  [10, 12], //sew
  [1, 13], //single
];

const snowytrees = [
  [22, 7], //surrounded
  [22, 6], //n
  [22, 8], //s
  [22, 7], //ns
  [23, 7], //e
  [23, 6], //ne
  [23, 8], //se
  [22, 7], //nse
  [21, 7], //w
  [21, 6], //nw
  [21, 8], //sw
  [22, 7], //nsw
  [22, 7], //ew
  [22, 7], //new
  [10, 12], //sew
  [20, 6], //single
];

// Snow
let snowflakes = [];
let snowflake_count = 300;

class Snowflake {
  static create(arr, count) {
    for (let i = 0; i < count; i++) {
      arr.push(new Snowflake());
    }
  }
  static update_arr(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].update();
    }
  }
  static draw_arr(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].draw();
    }
  }

  constructor() {
    this.reset();
    this.y = random(height);
  }
  reset() {
    this.x = random(width);
    this.y = random(-10, -50); // above screen
    this.r = random(2, 6);
    this.dy = map(this.r, 2, 6, 0.5, 2.8); // make y velocity determined on size
    this.dx = random(-0.3, 0.3);
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.y > height + this.r) {
      return true;
    }
    return false;
  }
  draw() {
    noStroke();
    rect(this.x, this.y, this.r, this.r);
  }
}
