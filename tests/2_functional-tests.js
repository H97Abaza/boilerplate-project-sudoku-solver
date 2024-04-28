const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    let puzzle =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    let solution =
        "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
    suite(
        "Solve a puzzle: POST request to /api/solve",
        () => {
            let invalid_puzzle =
              "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.377";
            test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done => {
                chai.request(server).post('/api/solve').send({ puzzle }).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "response body should be an Object");
                    assert.property(res.body, "solution", "response body should contains 'solution'")
                    assert.equal(res.body.solution, solution)
                    done();
                })
            }))
            test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done => {
                chai.request(server).post('/api/solve').end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "response body should be an Object");
                    assert.deepEqual(res.body, { error: 'Required field missing' });
                    done();
                })
            }))
            test("Solve a puzzle with invalid characters: POST request to /api/solve", (done => {
                chai.request(server).post('/api/solve').send({ puzzle: puzzle.replace("9", "a") }).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "response body should be an Object");
                    assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
                    done();
                })
            }))
            test("Solve a puzzle with incorrect length: POST request to /api/solve", (done => {
                chai.request(server).post('/api/solve').send({ puzzle: puzzle.substring(0, 70) }).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "response body should be an Object");
                    assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
                    done();
                })
            }))
            test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done => {
                chai.request(server).post('/api/solve').send({ puzzle: invalid_puzzle }).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "response body should be an Object");
                    assert.deepEqual(res.body, { error: "Puzzle cannot be solved" });
                    done();
                })
            }))





        }
    );
    suite(
        "Check a puzzle placement: POST request to /api/check",
        () => {
            let coordinate = "A2";
            let value = 3
            test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
                chai.request(server).post('/api/check').send({ puzzle, coordinate, value }).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "response body should be an Object");
                    assert.property(res.body, "valid", "response body should contains 'valid'");
                    assert.isBoolean(res.body.valid);
                    assert.equal(res.body.valid, true);
                    assert.property(res.body, "conflict", "response body should contains 'conflict'");
                    assert.isArray(res.body.conflict);
                    done();
                })
            });
            test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
                chai.request(server).post('/api/check').send({ puzzle, coordinate, value: 7 }).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "response body should be an Object");
                    assert.property(res.body, "valid", "response body should contains 'valid'");
                    assert.isBoolean(res.body.valid);
                    assert.equal(res.body.valid, false);
                    assert.property(res.body, "conflict", "response body should contains 'conflict'");
                    assert.isArray(res.body.conflict);
                    assert.lengthOf(res.body.conflict, 1);
                    assert.include(res.body.conflict, "column");
                    done();
                })
            });
            test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
                chai.request(server).post('/api/check').send({ puzzle, coordinate, value: 5 }).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "response body should be an Object");
                    assert.property(res.body, "valid", "response body should contains 'valid'");
                    assert.isBoolean(res.body.valid);
                    assert.equal(res.body.valid, false);
                    assert.property(res.body, "conflict", "response body should contains 'conflict'");
                    assert.isArray(res.body.conflict);
                    assert.lengthOf(res.body.conflict, 3);
                    assert.include(res.body.conflict, "row");
                    assert.include(res.body.conflict, "region");
                    done();
                })
            });
            test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
                chai.request(server).post('/api/check').send({ puzzle, coordinate, value: 2 }).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "response body should be an Object");
                    assert.property(res.body, "valid", "response body should contains 'valid'");
                    assert.isBoolean(res.body.valid);
                    assert.equal(res.body.valid, false);
                    assert.property(res.body, "conflict", "response body should contains 'conflict'");
                    assert.isArray(res.body.conflict);
                    assert.lengthOf(res.body.conflict, 3);
                    assert.include(res.body.conflict, "column");
                    assert.include(res.body.conflict, "row");
                    assert.include(res.body.conflict, "region");
                    done();
                })
            });
            test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
                chai.request(server).post('/api/check').send({ puzzle, coordinate }).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "response body should be an Object");
                    assert.deepEqual(res.body, { error: "Required field(s) missing" });
                    done();
                })
            });
            test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
                chai.request(server).post('/api/check').send({ puzzle, coordinate, value: "a" }).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "response body should be an Object");
                    assert.deepEqual(res.body, { error: "Invalid value" });
                    done();
                })
            });
            test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
                chai.request(server).post('/api/check').send({ puzzle: puzzle.substring(0, 75), coordinate, value }).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "response body should be an Object");
                    assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
                    done();
                })
            });
            test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
                chai.request(server).post('/api/check').send({ puzzle, coordinate: "A2a", value }).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "response body should be an Object");
                    assert.deepEqual(res.body, { error: "Invalid coordinate" });
                    done();
                })
            });
            test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
                chai.request(server).post('/api/check').send({ puzzle, coordinate, value: 11 }).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "response body should be an Object");
                    assert.deepEqual(res.body, { error: "Invalid value" });
                    done();
                })
            });










        }
    );
});

