var main = require("../main.js");

describe("Parameter tests", function() {
  describe("Parameter count tests", function() {
    describe("Fewer than 4 parameters - 2", function() {
      it("returns false", function(done) {
        expect(main.validateParams(["node", "main.js"])).toBe(false);
        done();
      });
    });

    describe("Fewer than 4 parameters - 3", function() {
      it("returns false", function(done) {
        expect(main.validateParams(["node", "main.js", "Bass Modulators"])).toBe(false);
        done();
      });
    });

    describe("Minimum number of valid parameters", function() {
      it("returns true", function(done) {
        expect(main.validateParams(["node", "main.js", "Da Tweekaz", "See The Light"])).toBe(true);
        done();
      });
    });

    describe("More than 6 parameters - 7", function() {
      it("returns false", function(done) {
        expect(main.validateParams(["node", "main.js", "Wasted Penguinz", "Magic", "Clarity", "2016", "Dirty Workz"])).toBe(false);
        done();
      });
    });
  });
  describe("Invalid size parameter", function() {
    describe("Invalid size parameter - decimal pixels", function() {
      it("returns false", function(done) {
        expect(main.validateParams(["node", "main.js", "Headhunterz", "Dragonborn", "678.902px"])).toBe(false);
        done();
      });
    });

    describe("Invalid size parameter - NaN", function() {
      it("returns false", function(done) {
        expect(main.validateParams(["node", "main.js", "Coone", "Robotz", "infinitely huge"])).toBe(false);
        done();
      });
    });
  });
  describe("Invalid API mode flag", function() {
    describe("Invalid API mode flag - numeral character other than one and two", function() {
      it("returns false", function(done) {
        expect(main.validateParams(["node", "main.js", "For the Fallen Dreams", "The Big Empty", "-3"])).toBe(false);
        done();
      });
    });

    describe("Invalid API mode flag - one nonnumeric character", function() {
      it("returns false", function(done) {
        expect(main.validateParams(["node", "main.js", "The Color Morale", "Keep Me In My Body", "-p"])).toBe(false);
        done();
      });
    });
  });
});
