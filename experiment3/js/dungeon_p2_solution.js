/* exported generateGrid, drawGrid */
/* global placeTile */

function generateGrid(numCols, numRows) {
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

  let maxCellW = floor(numRows / cellsCol);
  let maxCellH = floor(numCols / cellsRow);

  let rectGrid = [];

  for (let k = 0; k < cellsCol; k++) {
    let rectRow = [];
    for (let l = 0; l < cellsRow; l++) {
      let cellW = floor(random(maxCellW, 3)) - pad * 2;
      let cellH = floor(random(maxCellH, 3)) - pad * 2;
      let cellX = floor(random(0, 3)) + maxCellW * l + pad;
      let cellY = floor(random(0, 3)) + maxCellH * k + pad;
      rectRow.push([cellX, cellY, cellW, cellH]);
      for (let i = 0; i < cellH; i++) {
        for (let j = 0; j < cellW; j++) {
          grid[i + cellY][j + cellX] = ".";
        }
      }

      let poiX = floor(random(cellX + 1, cellX + cellW - 1));
      let poiY = floor(random(cellY + 1, cellY + cellH - 1));
      if (random(1) > 0.6) {
        grid[poiY][poiX] = "C";
      }

      if (k > 0) {
        let doorX = floor(random(cellX + 1, cellX + cellW - 1));
        let doorY = cellY;

        let room = rectGrid[k - 1][l];
        let otherDoorX = doorX;
        let otherDoorY = room[1] + room[3] - 1;

        for (let i = otherDoorY - 1; i <= doorY; i++) {
          for (let j = otherDoorX; j <= doorX; j++) {
            grid[i][j] = "=";
          }
        }

        if (random(1) > 0.5) {
          grid[doorY][doorX] = "D";
        }
        if (random(1) > 0.5) {
          grid[otherDoorY][otherDoorX] = "D";
        }
      }

      if (l > 0) {
        let doorX = cellX;
        let doorY = floor(random(cellY + 1, cellY + cellH - 1));

        let room = rectRow[l - 1];
        let otherDoorX = room[0] + room[3] - 1;
        let otherDoorY = doorY;

        for (let i = doorY; i <= otherDoorY; i++) {
          for (let j = doorX - 1; j <= otherDoorX; j++) {
            grid[i][j] = "=";
          }
        }

        if (random(1) > 0.5) {
          grid[doorY][doorX] = "D";
        }
        if (random(1) > 0.5) {
          grid[otherDoorY][otherDoorX] = "D";
        }
      }
      rectGrid.push(rectRow);
    }
  }

  return grid;
}

function drawGrid(grid) {
  background(0);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid, i, j, ".") || gridCheck(grid, i, j, "_")) {
        const bg = randBG[random(randBG.length) | 0];
        placeTile(i, j, bg[0], bg[1]);
      } else if (gridCheck(grid, i, j, "=")) {
        const p = randPath[random(randPath.length) | 0];
        placeTile(i, j, p[0], p[1]);
      }

      if (gridCheck(grid, i, j, "_")) {
        const p = randPurple[random(randPurple.length) | 0];
        placeTile(i, j, p[0], p[1]);
      } else {
        drawContext(grid, i, j, "_", 0, 0, dungeonEdge);
      }

      if (gridCheck(grid, i, j, "C")) {
        placeTile(i, j, random(6) | 0, (random(3) | 0) + 28);
      }
      if (gridCheck(grid, i, j, "D")) {
        placeTile(i, j, 5, 25 + (random(3) | 0));
      }
    }
  }
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
