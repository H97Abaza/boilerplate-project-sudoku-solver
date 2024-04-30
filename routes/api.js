'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { coordinate, puzzle, value } = req.body;
      if (![coordinate, puzzle, value].every(Boolean)) return res.json({ error: "Required field(s) missing" });
      if (!coordinate.match(/^[A-I][1-9]$/i)) return res.json({ error: "Invalid coordinate" });
      if (!value.match(/^[1-9]$/)) return res.json({ error: "Invalid value" });
      const [row, column] = coordinate
      if (solver.validate(puzzle) === true) {
        const ch_col = solver.checkColPlacement(puzzle, row, column, value)
        const ch_row = solver.checkRowPlacement(puzzle, row, column, value)
        const ch_region = solver.checkRegionPlacement(puzzle, row, column, value)
        if (ch_col && ch_row && ch_region)
          res.json({
            valid: true,
          });
        else {
          let conflict = []
          if (!ch_row) conflict.push("row");
          if (!ch_col) conflict.push("column");
          if (!ch_region) conflict.push("region");
          res.json({ valid: false, conflict });
        }
      } else {
        res.json({ error: solver.validate(puzzle) })
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      if (!puzzle) return res.json({ error: "Required field missing" });
      let validation = solver.validate(puzzle);
      if (validation === true) {
        let solution = solver.solve(puzzle)
        if (solution === "Puzzle cannot be solved") return res.json({ error: solution })
        res.json({ solution });
      } else {
        let error = validation
        res.json({ error })
      }
    });
};
