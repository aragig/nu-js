const {expect} = require("chai");
const neoux = require("../js/neoux.js")


describe("neoux", function() {
    it("example関数が2倍を返す", function() {
        expect(neoux.example(3)).to.equal(6);
    });
});


describe("neoux.overlay", () => {
    // テスト前に強制的に初期化（.nuOverlay を必ず削除する）
    beforeEach(() => {
        // 念のため全部削除
        document.querySelectorAll(".nuOverlay").forEach(el => el.remove());
    });

    it("should add overlay element to DOM", () => {
        const before = document.querySelectorAll(".nuOverlay").length;

        const el = window.neoux.overlay.show();

        const after = document.querySelectorAll(".nuOverlay").length;
        expect(after).to.equal(before + 1);
        expect(el.className).to.equal("nuOverlay");
    });

    it("should remove overlay element from DOM after hide()", (done) => {
        window.neoux.overlay.show();
        const overlay = document.querySelector(".nuOverlay");

        expect(overlay).to.exist;

        window.neoux.overlay.hide();

        setTimeout(() => {
            const exists = document.querySelector(".nuOverlay");
            expect(exists).to.be.null;
            done();
        }, 250); // hide() 内の setTimeout(…, 200) に合わせる
    });
});
