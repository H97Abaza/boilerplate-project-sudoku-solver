const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    let puzzleString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    let invalidPuzzleString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.311";
    let incompletePuzzleString = puzzleString.substring(0, 80)
    let solution =
        "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
    let row = "A"
    let column = "2"
    let value = "3"

    suite("Test Solver.validate(puzzleString)", () => {
        // Logic handles a valid puzzle string of 81 characters
        suite("Logic handles a valid puzzle string of 81 characters", () => {
            assert.equal(solver.validate(puzzleString), true);
        })

        // Logic handles a puzzle string with invalid characters (not 1-9 or .)
        suite("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
            assert.equal(solver.validate(puzzleString.replace(".", "a")), "Invalid characters in puzzle");
        })

        // Logic handles a puzzle string that is not 81 characters in length
        suite("Logic handles a puzzle string that is not 81 characters in length", () => {
            assert.equal(solver.validate(puzzleString.substring(0, 80)), "Expected puzzle to be 81 characters long");
        })

    })

    suite("Test Solver.checkRowPlacement()", () => {

        // Logic handles a valid row placement
        suite("Logic handles a valid row placement", () => {
            assert.deepEqual(solver.checkRowPlacement(puzzleString, row, column, value), true);
        })

        // Logic handles an invalid row placement
        suite("Logic handles an invalid row placement", () => {
            assert.equal(solver.checkRowPlacement(puzzleString, "B", column, value), false);
        })
    })

    suite("Test Solver.checkColPlacement()", () => {

        // Logic handles a valid column placement
        suite("Logic handles a valid column placement", () => {
            assert.equal(solver.checkColPlacement(puzzleString, row, column, value), true);
        })

        // Logic handles an invalid column placement
        suite("Logic handles an invalid column placement", () => {
            assert.equal(solver.checkColPlacement(puzzleString, row, 1, value), false);
        })
    })

    suite("Test Solver.checkRegionPlacement()", () => {

        // Logic handles a valid region (3x3 grid) placement
        suite("Logic handles a valid region (3x3 grid) placement", () => {
            assert.equal(solver.checkRegionPlacement(puzzleString, row, column, value), true);
        })

        // Logic handles an invalid region (3x3 grid) placement
        suite("Logic handles an invalid region (3x3 grid) placement", () => {
            assert.equal(solver.checkRegionPlacement(puzzleString, row, column, 6), false);
        })
    })

    suite("Test Solver.solve()", () => {

        // Valid puzzle strings pass the solver
        suite("Valid puzzle strings pass the solver", () => {
            assert.equal(solver.solve(puzzleString), solution, "Valid puzzle strings should pass the solver");
        })

        // Invalid puzzle strings fail the solver
        suite("Invalid puzzle strings fail the solver", () => {
            assert.equal(
                solver.solve(invalidPuzzleString),
                "Puzzle cannot be solved",
                "Invalid puzzle strings should fail the solver"
            );
        })

        // Solver returns the expected solution for an incomplete puzzle
        suite("Solver returns the expected solution for an incomplete puzzle", () => {
            assert.equal(
                solver.solve(incompletePuzzleString),
                "Expected puzzle to be 81 characters long",
                "Solver should returns the expected solution for an incomplete puzzle"
            );
        })
    })

});
