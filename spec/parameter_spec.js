var main = require("../main.js");

describe("Parameter tests", function() {
  describe("Fewer than 4 parameters", function() {
    it("returns false", function(done) {
      expect(main.validateParams(["node", "main.js"])).toBe(false);
      done();
    });
  });

  describe("More than 5 parameters", function() {
    it("returns false", function(done) {
      expect(main.validateParams(["node", "main.js", "Wasted Penguinz", "Magic", "Clarity", "2016"])).toBe(false);
      done();
    });
  });
});
