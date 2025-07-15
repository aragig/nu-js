const {expect} = require("chai");
const neoux = require("../js/neoux.js")


describe("neoux", function() {
    it("example関数が2倍を返す", function() {
        expect(neoux.example(3)).to.equal(6);
    });
});
