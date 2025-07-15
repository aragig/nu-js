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
// テスト: オーバーレイ制御ユーティリティ
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

    it("neoux.alert()のテスト: OKボタンをレンダリングし、コールバックを呼び出す必要があります", (done) => {
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

    it("neoux.confirm()のテスト: OKとキャンセルボタンをレンダリングし、コールバックを呼び出す必要があります", (done) => {
        let okCalled = false;
        let cancelCalled = false;

        window.neoux.confirm("確認メッセージ", () => {
            okCalled = true;
        }, () => {
            cancelCalled = true;
        });

        const buttons = document.querySelectorAll(".nuAlertButton");
        expect(buttons.length).to.equal(2);

        const cancelButton = [...buttons].find(btn => btn.textContent === "キャンセル");
        const okButton = [...buttons].find(btn => btn.textContent === "OK");

        expect(cancelButton).to.exist;
        expect(okButton).to.exist;

        // キャンセルを先にクリック
        cancelButton.click();
        expect(cancelCalled).to.be.true;

        // DOMが消えるのを確認して次の処理へ
        setTimeout(() => {
            expect(document.querySelector(".nuAlertBox")).to.be.null;

            // confirmの再表示（OKボタンテスト）
            window.neoux.confirm("再確認", () => {
                okCalled = true;
            }, () => {});

            const okBtn2 = [...document.querySelectorAll(".nuAlertButton")]
                .find(btn => btn.textContent === "OK");
            okBtn2.click();

            setTimeout(() => {
                expect(okCalled).to.be.true;
                expect(document.querySelector(".nuAlertBox")).to.be.null;
                done();
            }, window.neoux.overlay.timeout);
        }, window.neoux.overlay.timeout);
    });

    it("neoux.sheet()のテスト: 複数ボタンを表示し、クリックで対応するラベルが一致するか", (done) => {
        const labels = ["編集", "削除", "複製", "キャンセル"];
        const clicked = [];

        window.neoux.sheet("操作を選んでください", labels.map(label => ({
            label,
            callback: () => clicked.push(label)
        })));

        const buttons = document.querySelectorAll(".nuAlertButton");
        expect(buttons.length).to.equal(labels.length);

        // "複製"ボタンをクリック
        const copyBtn = [...buttons].find(btn => btn.textContent === "複製");
        expect(copyBtn).to.exist;
        copyBtn.click();

        setTimeout(() => {
            expect(clicked).to.include("複製");
            expect(document.querySelector(".nuAlertBox")).to.be.null;
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