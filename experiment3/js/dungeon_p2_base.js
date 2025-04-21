/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

var t = function (p) {
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
    p.select("#seedReport_2").html("seed " + seed);
    p.regenerateGrid();
  };

  p.regenerateGrid = function () {
    p.select("#asciiBox_2").value(
      p.gridToString(p.generateGrid(numCols, numRows))
    );
    p.reparseGrid();
  };

  p.reparseGrid = function () {
    currentGrid = p.stringToGrid(p.select("#asciiBox_2").value());
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
    numCols = p.select("#asciiBox_2").attribute("rows") | 0;
    numRows = p.select("#asciiBox_2").attribute("cols") | 0;

    p.createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer_2");
    p.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

    p.select("#reseedButton_2").mousePressed(p.reseed);
    p.select("#asciiBox_2").input(p.reparseGrid);

    p.reseed();
  };

  p.draw = function () {
    p.randomSeed(seed);
    p.drawGrid(currentGrid);
  };

  p.placeTile = function (i, j, ti, tj) {
    p.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  };

  p.generateGrid = function (numCols, numRows) {
    let grid = [];
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        row.push("_");
      }
      grid.push(row);
    }

    // carve rooms

    let cellsRow = 3;
    let cellsCol = 3;
    let pad = 0;

    let maxCellW = p.floor(numRows / cellsCol);
    let maxCellH = p.floor(numCols / cellsRow);

    let rectGrid = [];

    for (let k = 0; k < cellsCol; k++) {
      let rectRow = [];
      for (let l = 0; l < cellsRow; l++) {
        let cellW = p.floor(p.random(maxCellW, 3)) - pad * 2;
        let cellH = p.floor(p.random(maxCellH, 3)) - pad * 2;
        let cellX = p.floor(p.random(0, 3)) + maxCellW * l + pad;
        let cellY = p.floor(p.random(0, 3)) + maxCellH * k + pad;
        rectRow.push([cellX, cellY, cellW, cellH]);
        for (let i = 0; i < cellH; i++) {
          for (let j = 0; j < cellW; j++) {
            grid[i + cellY][j + cellX] = ".";
          }
        }

        let poiX = p.floor(p.random(cellX + 1, cellX + cellW - 1));
        let poiY = p.floor(p.random(cellY + 1, cellY + cellH - 1));
        if (p.random(1) > 0.6) {
          grid[poiY][poiX] = "C";
        }

        if (k > 0) {
          let doorX = p.floor(p.random(cellX + 1, cellX + cellW - 1));
          let doorY = cellY;

          let room = rectGrid[k - 1][l];
          let otherDoorX = doorX;
          let otherDoorY = room[1] + room[3] - 1;

          for (let i = otherDoorY - 1; i <= doorY; i++) {
            for (let j = otherDoorX; j <= doorX; j++) {
              grid[i][j] = "=";
            }
          }

          if (p.random(1) > 0.5) {
            grid[doorY][doorX] = "D";
          }
          if (p.random(1) > 0.5) {
            grid[otherDoorY][otherDoorX] = "D";
          }
        }

        if (l > 0) {
          let doorX = cellX;
          let doorY = p.floor(p.random(cellY + 1, cellY + cellH - 1));

          let room = rectRow[l - 1];
          let otherDoorX = room[0] + room[3] - 1;
          let otherDoorY = doorY;

          for (let i = doorY; i <= otherDoorY; i++) {
            for (let j = doorX - 1; j <= otherDoorX; j++) {
              grid[i][j] = "=";
            }
          }

          if (p.random(1) > 0.5) {
            grid[doorY][doorX] = "D";
          }
          if (p.random(1) > 0.5) {
            grid[otherDoorY][otherDoorX] = "D";
          }
        }
        rectGrid.push(rectRow);
      }
    }

    return grid;
  };

  p.drawGrid = function (grid) {
    p.background(0);

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (p.gridCheck(grid, i, j, ".") || p.gridCheck(grid, i, j, "_")) {
          const bg = randBG[p.random(randBG.length) | 0];
          p.placeTile(i, j, bg[0], bg[1]);
        } else if (p.gridCheck(grid, i, j, "=")) {
          const bg = randPath[p.random(randPath.length) | 0];
          p.placeTile(i, j, bg[0], bg[1]);
        }

        if (p.gridCheck(grid, i, j, "_")) {
          const bg = randPurple[p.random(randPurple.length) | 0];
          p.placeTile(i, j, bg[0], bg[1]);
        } else {
          p.drawContext(grid, i, j, "_", 0, 0, dungeonEdge);
        }

        if (p.gridCheck(grid, i, j, "C")) {
          p.placeTile(i, j, p.random(6) | 0, (p.random(3) | 0) + 28);
        }
        if (p.gridCheck(grid, i, j, "D")) {
          p.placeTile(i, j, 5, 25 + (p.random(3) | 0));
        }
      }
    }
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
    //p.placeTile(i, j, dti, dtj);
  };

  const randBG = [
    [26, 24],
    [21, 24],
    [21, 23],
    [21, 22],
    [21, 21],
    [20, 23],
    [20, 23],
    [20, 23],
    [20, 23],
  ];

  const randPath = [
    [20, 22],
    [20, 22],
    [20, 22],
    [20, 22],
    [20, 22],
    [26, 24],
    [27, 24],
    [28, 24],
    [26, 24],
  ];

  const randPurple = [
    [6, 24],
    [1, 24],
    [1, 23],
    [1, 22],
    [1, 21],
    [0, 23],
    [0, 23],
    [0, 23],
    [0, 23],
  ];

  const dungeonEdge = [
    [6, 22], //surrounded
    [6, 23], //n
    [6, 21], //s
    [6, 22], //ns
    [5, 22], //e
    [5, 23], //ne
    [5, 21], //se
    [1, 24], //nse
    [7, 22], //w
    [7, 23], //nw
    [7, 21], //sw
    [1, 24], //nsw
    [1, 24], //ew
    [1, 24], //new
    [1, 24], //sew
    [1, 22], //single
  ];
};

var myp5 = new p5(t, "c2");
