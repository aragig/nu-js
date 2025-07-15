const {expect} = require("chai");
const neoux = require("../js/neoux.js")


//------------------------------------------------------------------------------------
// テストコードのテスト用
//------------------------------------------------------------------------------------
describe("neoux", function() {
    it("example関数が2倍を返す", function() {
        expect(neoux.__example(3)).to.equal(6);
    });
});


//------------------------------------------------------------------------------------
// カスタムアラート
//------------------------------------------------------------------------------------
describe("neoux.overlay", () => {
    // 各テスト前に強制的に初期化
    beforeEach(() => {
        document.body.innerHTML = "";
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


//------------------------------------------------------------------------------------
// ローディングインジケータ
//------------------------------------------------------------------------------------
describe("neoux.loading", () => {
    // 各テスト前に強制的に初期化
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should show loading spinner and message", () => {
        window.neoux.loading.show("読み込み中...");

        const spinner = document.querySelector(".nuLoadingSpinner");
        const msgBox = document.querySelector(".nuLoadingMessage");
        const overlay = document.querySelector(".nuOverlay");

        expect(spinner).to.exist;
        expect(spinner.className).to.equal("nuLoadingSpinner");

        expect(msgBox).to.exist;
        expect(msgBox.textContent).to.equal("読み込み中...");

        expect(overlay).to.exist;
    });

    it("should hide loading spinner and message after delay", (done) => {
        window.neoux.loading.show("処理中");
        window.neoux.loading.hide();

        setTimeout(() => {
            const spinner = document.querySelector(".nuLoadingSpinner");
            const msgBox = document.querySelector(".nuLoadingMessage");
            const overlay = document.querySelector(".nuOverlay");

            expect(spinner).to.be.null;
            expect(msgBox).to.be.null;
            expect(overlay).to.be.null;

            done();
        }, 200); // remove() まで200msなので余裕を持って250ms待つ
    });

    it("should handle show() with no message", () => {
        window.neoux.loading.show();

        const msgBox = document.querySelector(".nuLoadingMessage");
        expect(msgBox).to.exist;
        expect(msgBox.textContent).to.equal("");
    });
});