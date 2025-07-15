const {expect} = require("chai");
const neoux = require("../js/neoux.js")


//------------------------------------------------------------------------------------
// テスト: テストコード用のテスト
//------------------------------------------------------------------------------------
describe("neoux", function() {
    it("example関数が2倍を返す", function() {
        expect(neoux.__example(3)).to.equal(6);
    });
});


//------------------------------------------------------------------------------------
// テスト: カスタムアラート
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

    it("should remove overlay element from DOM after hide()", async() => {
        window.neoux.overlay.show();
        const overlay = document.querySelector(".nuOverlay");
        expect(overlay).to.exist;

        await window.neoux.overlay.hide();

        const exists = document.querySelector(".nuOverlay");
        expect(exists).to.be.null;
    });
});

//------------------------------------------------------------------------------------
// テスト: カスタムアラート
//------------------------------------------------------------------------------------
describe("neoux.alert / confirm / sheet", () => {
    // 各テスト前に強制的に初期化
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("alert: should render OK button and call callback", (done) => {
        let called = false;
        window.neoux.alert("アラートメッセージ", () => {
            called = true;
        });

        const button = document.querySelector(".nuAlertButton");
        expect(button).to.exist;
        expect(button.textContent).to.equal("OK");

        // simulate click
        button.click();
        expect(called).to.be.true;

        setTimeout(() => {
            const box = document.querySelector(".nuAlertBox");
            expect(box).to.be.null;
            done();
        }, window.neoux.overlay.timeout);
    });

});

//------------------------------------------------------------------------------------
// テスト: ローディングインジケータ
//------------------------------------------------------------------------------------
describe("neoux.loading", () => {
    // 各テスト前に強制的に初期化
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("show()のテスト: 読み込みスピナーとメッセージを表示", () => {
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

    it("hide()のテスト: 遅延後に読み込みスピナーとメッセージの非表示確認", async() => {
        window.neoux.loading.show("処理中");
        await window.neoux.loading.hide();

        const spinner = document.querySelector(".nuLoadingSpinner");
        const msgBox = document.querySelector(".nuLoadingMessage");
        const overlay = document.querySelector(".nuOverlay");

        expect(spinner).to.be.null;
        expect(msgBox).to.be.null;
        expect(overlay).to.be.null;
    });

    it("show()のテスト: メッセージなしで確認", () => {
        window.neoux.loading.show();

        const msgBox = document.querySelector(".nuLoadingMessage");
        expect(msgBox).to.exist;
        expect(msgBox.textContent).to.equal("");
    });
});