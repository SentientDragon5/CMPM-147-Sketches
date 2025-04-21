/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

var s = function (p) {
  let seed = 0;
  let tilesetImage;
  let currentGrid = [];
  let numRows, numCols;

  p.preload = function () {
    tilesetImage = p.loadImage("./img/tileset.png");
  };

  p.reseed = function () {
    seed = (seed | 0) + 1109;
    p.randomSeed(seed);
    p.noiseSeed(seed);
    p.select("#seedReport").html("seed " + seed);
    p.regenerateGrid();
  };

  p.regenerateGrid = function () {
    p.select("#asciiBox").value(
      p.gridToString(p.generateGrid(numCols, numRows))
    );
    p.reparseGrid();
  };

  p.reparseGrid = function () {
    currentGrid = p.stringToGrid(p.select("#asciiBox").value());
  };

  p.gridToString = function (grid) {
    let rows = [];
    for (let i = 0; i < grid.length; i++) {
      rows.push(grid[i].join(""));
    }
    return rows.join("\n");
  };

  p.stringToGrid = function (str) {
    let grid = [];
    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let row = [];
      let chars = lines[i].split("");
      for (let j = 0; j < chars.length; j++) {
        row.push(chars[j]);
      }
      grid.push(row);
    }
    return grid;
  };

  p.setup = function () {
    numCols = p.select("#asciiBox").attribute("rows") | 0;
    numRows = p.select("#asciiBox").attribute("cols") | 0;

    p.createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
    p.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

    p.select("#reseedButton").mousePressed(p.reseed);
    p.select("#asciiBox").input(p.reparseGrid);

    p.reseed();
  };

  p.draw = function () {
    p.randomSeed(seed);
    p.drawGrid(currentGrid);
  };

  p.placeTile = function (i, j, ti, tj) {
    p.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  };

  /* exported generateGrid, drawGrid */
  /* global p.placeTile */

  const noiseScale = 1 / 12;

  p.generateGrid = function (numCols, numRows) {
    let grid = [];
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        let n = p.noise(i * noiseScale, j * noiseScale);
        if (p.round(n * 100 * 3) == 56 * 3) {
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
  };

  p.drawGrid = function (grid) {
    p.background(128);

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        // Water under layer
        p.placeTile(i, j, p.random(4) | 0, 13);

        // place grass
        if (
          p.gridCheck(grid, i, j, "_") ||
          p.gridCheck(grid, i, j, "t") ||
          p.gridCheck(grid, i, j, "h")
        ) {
          p.placeTile(i, j, p.random(4) | 0, 12);
        } else {
          // place cliffs
          p.drawContext(grid, i, j, "_", 5, 0, snowyCliffsOverWater);
        }

        if (p.gridCheck(grid, i, j, "t")) {
          p.drawContext(grid, i, j, "t", 0, 0, snowytrees);
        }
        if (p.gridCheck(grid, i, j, "h")) {
          p.placeTile(i, j, 26 + (p.random(2) | 0), p.random(4) | 0);
        }
      }
    }

    Snowflake.update_arr(snowflakes);
    Snowflake.draw_arr(snowflakes);
  };

  p.gridCheck = function (grid, i, j, target) {
    if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
      return grid[i][j] == target;
    }

    return false;
  };

  p.gridCode = function (grid, i, j, target) {
    const n = p.gridCheck(grid, i + 1, j, target);
    const s = p.gridCheck(grid, i - 1, j, target);
    const e = p.gridCheck(grid, i, j + 1, target);
    const w = p.gridCheck(grid, i, j - 1, target);
    return (n << 0) + (s << 1) + (w << 2) + (e << 3);
  };

  p.drawContext = function (grid, i, j, target, dti, dtj, lookup) {
    const tileCode = p.gridCode(grid, i, j, target);
    const w = lookup[tileCode];
    if (tileCode != 0) {
      p.placeTile(i, j, w[0], w[1]);
    }
    //placeTile(i, j, dti, dtj);
  };

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
      this.y = p.random(p.height);
    }
    reset() {
      this.x = p.random(p.width);
      this.y = p.random(-10, -50); // above screen
      this.r = p.random(2, 6);
      this.dy = p.map(this.r, 2, 6, 0.5, 2.8); // make y velocity determined on size
      this.dx = p.random(-0.3, 0.3);
    }
    update() {
      this.x += this.dx;
      this.y += this.dy;

      if (this.y > p.height + this.r) {
        return true;
      }
      return false;
    }
    draw() {
      p.noStroke();
      p.rect(this.x, this.y, this.r, this.r);
    }
  }
};

var myp5 = new p5(s, "c1");
