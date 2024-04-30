class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length !== 81)
      return "Expected puzzle to be 81 characters long";
    if (puzzleString.match(/[^0-9.]/)) return "Invalid characters in puzzle";
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rows = puzzleString.match(/[1-9.]{9}/g);
    let rowString = rows[row.toLowerCase().charCodeAt(0) - 97];
    let ret = true;
    if (rowString.match(value)) ret = false;
    /* console.log(
      "Row Placement:\t\tCOL:",
      column,
      "ROW:",
      row,
      " VALUE:",
      value,
      " Row STR:\t",
      rowString,
      "\tValid:",
      ret
    ); */
    return ret;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let columnString = puzzleString.replace(
      /(.)(.)(.)(.)(.)(.)(.)(.)(.)/g,
      "$" + column
    );
    let ret = true;
    if (columnString.match(value)) ret = false;
    /* console.log(
      "Column Placement:\tCOL:",
      column,
      "ROW:",
      row,
      " VALUE:",
      value,
      " Column STR:\t",
      columnString,
      "\tValid:",
      ret
    ); */
    return ret;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    row = row.toLowerCase().charCodeAt(0) - 97;
    let cstart = Math.floor((column - 1) / 3) * 3;
    let cend = cstart + 3;
    let rstart = Math.floor(row / 3) * 3;
    let rend = rstart + 3;
    let region = puzzleString
      .match(/[1-9.]{9}/g)
      .slice(rstart, rend)
      .map((row) => row.substring(cstart, cend))
      .join("");
    let ret = true;
    if (region.match(value)) ret = false;
   /*  console.log(
      "Region Placement:\tCOL:",
      column,
      "ROW:",
      row,
      " VALUE:",
      value,
      " Region STR:\t",
      region,
      "\tValid:",
      ret,
      " Positions(3x3):\tCOL:",
      cstart,
      "-",
      cend,
      " | ROW:",
      rstart,
      "-",
      rend
    ); */
    return ret;
  }
  solve(puzzleString) {
    try {
      if (this.validate(puzzleString) === true) {
        let tmpPuzzle = puzzleString;
        const replaceAt = (str, ind, ch) =>
          str.substring(0, ind) + ch + str.substring(++ind);
        const findEmptyCell = () => {
          let i = tmpPuzzle.indexOf(".");
          // console.log("index: ", i);
          if (i == -1) return false;
          return {
            row: String.fromCharCode(65 + Math.floor(i / 9)),
            column: (i % 9) + 1,
            index: i,
          };
        };
        const isValid = (puzzle, row, column, value) => {
          return (
            this.checkColPlacement(puzzle, row, column, value) &&
            this.checkRowPlacement(puzzle, row, column, value) &&
            this.checkRegionPlacement(puzzle, row, column, value)
          );
        };
        function recursive_solve(puzzleString) {
          tmpPuzzle = puzzleString;
          // console.log("TMP Puzzle:\t", tmpPuzzle);

          if (!findEmptyCell()) {
            return true;
          }

          const { row, column, index } = findEmptyCell();
          for (let i = 1; i <= 9; i++) {
            if (isValid(puzzleString, row, column, i)) {
              tmpPuzzle = replaceAt(tmpPuzzle, index, i);
              if (recursive_solve(tmpPuzzle)) {
                return true;
              }
              tmpPuzzle = replaceAt(tmpPuzzle, index, ".");
            }
          }
          return false;
        }
        if (recursive_solve(tmpPuzzle)) {
          return tmpPuzzle;
        } else {
          return "Puzzle cannot be solved";
        }
      } else {
        return this.validate(puzzleString);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = SudokuSolver;
