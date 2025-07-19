const { JSDOM } = require("jsdom");

const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
    url: "http://localhost",
    pretendToBeVisual: true, // requestAnimationFrame の有効化
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.requestAnimationFrame = dom.window.requestAnimationFrame;
global.cancelAnimationFrame = dom.window.cancelAnimationFrame;


const {expect} = require("chai");
const nu = require("../js/neoux.js")


//------------------------------------------------------------------------------------
// テスト: テストコード用のテスト
//------------------------------------------------------------------------------------
describe("nu.__example", function() {
    it("example関数が2倍を返す", function() {
        expect(nu.__example(3)).to.equal(6);
    });
});


//------------------------------------------------------------------------------------
// テスト: オーバーレイ制御ユーティリティ
//------------------------------------------------------------------------------------
describe("nu.overlay", () => {
    // 各テスト前に強制的に初期化
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should add overlay element to DOM", () => {
        const before = document.querySelectorAll(".nuOverlay").length;

        const el = nu.overlay.show();

        const after = document.querySelectorAll(".nuOverlay").length;
        expect(after).to.equal(before + 1);
        expect(el.className).to.equal("nuOverlay");
    });

    it("should remove overlay element from DOM after hide()", async() => {
        nu.overlay.show();
        const overlay = document.querySelector(".nuOverlay");
        expect(overlay).to.exist;

        await nu.overlay.hide();

        const exists = document.querySelector(".nuOverlay");
        expect(exists).to.be.null;
    });
});


//------------------------------------------------------------------------------------
// テスト: カスタムアラート
//------------------------------------------------------------------------------------
describe("nu.alert / confirm / sheet", () => {
    // 各テスト前に強制的に初期化
    beforeEach(() => {
        document.body.innerHTML = "";
    });


    it("nu.alert()のテスト: コールバックなしのシンプルなアラート", (done) => {
        nu.alert("アラートメッセージ");

        const button = document.querySelector(".nuAlertButton");
        expect(button).to.exist;
        expect(button.textContent).to.equal("OK");

        // simulate click
        button.click();

        setTimeout(() => {
            const box = document.querySelector(".nuAlertBox");
            expect(box).to.be.null;
            done();
        }, nu.overlay.timeout);
    });

    it("nu.alert()のテスト: OKボタンをレンダリングし、コールバックを呼び出す必要があります", (done) => {
        let called = false;
        nu.alert("アラートメッセージ", () => {
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
        }, nu.overlay.timeout);
    });

    it("nu.confirm()のテスト: OKとキャンセルボタンをレンダリングし、コールバックを呼び出す必要があります", (done) => {
        let okCalled = false;
        let cancelCalled = false;

        nu.confirm("確認メッセージ", () => {
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
            nu.confirm("再確認", () => {
                okCalled = true;
            }, () => {});

            const okBtn2 = [...document.querySelectorAll(".nuAlertButton")]
                .find(btn => btn.textContent === "OK");
            okBtn2.click();

            setTimeout(() => {
                expect(okCalled).to.be.true;
                expect(document.querySelector(".nuAlertBox")).to.be.null;
                done();
            }, nu.overlay.timeout);
        }, nu.overlay.timeout);
    });

    it("nu.sheet()のテスト: 複数ボタンを表示し、クリックで対応するラベルが一致するか", (done) => {
        const labels = ["編集", "削除", "複製", "キャンセル"];
        const clicked = [];

        nu.sheet("操作を選んでください", labels.map(label => ({
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
        }, nu.overlay.timeout);
    });
});


//------------------------------------------------------------------------------------
// テスト: ローディングインジケータ
//------------------------------------------------------------------------------------
describe("nu.loading", () => {
    // 各テスト前に強制的に初期化
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("show()のテスト: 読み込みスピナーとメッセージを表示", () => {
        nu.loading.show("読み込み中...");

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
        nu.loading.show("処理中");
        await nu.loading.hide();

        const spinner = document.querySelector(".nuLoadingSpinner");
        const msgBox = document.querySelector(".nuLoadingMessage");
        const overlay = document.querySelector(".nuOverlay");

        expect(spinner).to.be.null;
        expect(msgBox).to.be.null;
        expect(overlay).to.be.null;
    });

    it("show()のテスト: メッセージなしで確認", () => {
        nu.loading.show();

        const msgBox = document.querySelector(".nuLoadingMessage");
        expect(msgBox).to.exist;
        expect(msgBox.textContent).to.equal("");
    });
});


//------------------------------------------------------------------------------------
// TODO テスト: トースト通知
//------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------
// TODO テスト: ドロップダウンメニュー
//------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------
// TODO テスト: セグメントボタン
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
// TODO テスト: 検索ボックス
//------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------
// テスト: Submit
//------------------------------------------------------------------------------------
describe("nu.submit.values", () => {
    // 各テスト前に初期化
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("フォーム内のinput, select, textarea要素から値を取得してコールバックに渡す", (done) => {
        // フォーム要素の作成
        const form = document.createElement("form");
        form.id = "myForm";

        // テキスト入力
        const inputText = document.createElement("input");
        inputText.name = "username";
        inputText.type = "text";
        inputText.value = "Alice";
        form.appendChild(inputText);

        // テキストエリア
        const textarea = document.createElement("textarea");
        textarea.name = "comment";
        textarea.value = "Hello";
        form.appendChild(textarea);

        // セレクト
        const select = document.createElement("select");
        select.name = "color";
        const opt1 = document.createElement("option"); opt1.value = "red"; opt1.textContent = "Red";
        const opt2 = document.createElement("option"); opt2.value = "blue"; opt2.textContent = "Blue";
        select.appendChild(opt1);
        select.appendChild(opt2);
        select.value = "blue";
        form.appendChild(select);

        // チェックボックス
        const checkbox = document.createElement("input");
        checkbox.name = "subscribe";
        checkbox.type = "checkbox";
        checkbox.checked = true;
        form.appendChild(checkbox);

        // ラジオボタン
        const radio1 = document.createElement("input");
        radio1.name = "gender";
        radio1.type = "radio";
        radio1.value = "male";
        const radio2 = document.createElement("input");
        radio2.name = "gender";
        radio2.type = "radio";
        radio2.value = "female";
        radio2.checked = true;
        form.appendChild(radio1);
        form.appendChild(radio2);

        // name属性なし要素は無視される
        const noName = document.createElement("input");
        noName.type = "text";
        noName.value = "ignore";
        form.appendChild(noName);

        document.body.appendChild(form);

        window.nu.submit.values("myForm", (values) => {
            expect(values).to.deep.equal({
                username: "Alice",
                comment: "Hello",
                color: "blue",
                subscribe: true,
                gender: "female"
            });
            done();
        });
    });

    it("targetが不正またはcallbackが関数でない場合はエラーにならない", () => {
        expect(() => window.nu.submit.values(null, () => {})).to.not.throw();
        expect(() => window.nu.submit.values(document.createElement('div'), null)).to.not.throw();
    });
});


//------------------------------------------------------------------------------------
// 入力欄に対して文字数カウンターを追加する
//------------------------------------------------------------------------------------
describe("nu.count", () => {
    // 各テスト前に強制的に初期化
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("カウンターが生成されること", () => {
        const input = document.createElement("input");
        input.id = "testInput";
        input.value = "abc";
        document.body.appendChild(input);

        nu.count("testInput", 10);

        const counter = document.getElementById("testInput_counter");
        expect(counter).to.exist;
        expect(counter.textContent).to.equal("3");
        expect(counter.style.color).to.equal("rgb(136, 136, 136)"); // #888
    });

    it("制限を超えたときに赤色になる", () => {
        const textarea = document.createElement("textarea");
        textarea.id = "testTextarea";
        textarea.value = "これは長いテキストです";
        document.body.appendChild(textarea);

        nu.count("testTextarea", 5); // 制限5を超えている

        const counter = document.getElementById("testTextarea_counter");
        expect(counter).to.exist;
        expect(counter.textContent).to.equal(String(textarea.value.length));
        expect(counter.style.color).to.equal("red");
    });

    it("2重生成されないこと", () => {
        const input = document.createElement("input");
        input.id = "doubleInput";
        input.value = "1234";
        document.body.appendChild(input);

        nu.count("doubleInput", 10);
        nu.count("doubleInput", 10); // 2回呼び出し

        const counters = document.querySelectorAll("#doubleInput_counter");
        expect(counters.length).to.equal(1);
    });

    it("idがない場合は追加されない", () => {
        const input = document.createElement("input");
        input.value = "no id";
        document.body.appendChild(input);

        nu.count("", 10);

        const counter = document.querySelector(".nuCharCounter");
        expect(counter).to.be.null;
    });

    it("文字を追加したときにカウントが更新される", () => {
        const input = document.createElement("input");
        input.id = "dynamicInput";
        input.value = "123";
        document.body.appendChild(input);

        nu.count("dynamicInput", 10);

        const counter = document.getElementById("dynamicInput_counter");
        expect(counter.textContent).to.equal("3");

        // 値を追加
        input.value += "45";

        // inputイベントを発火（手動で）
        const event = new window.Event("input", { bubbles: true });
        input.dispatchEvent(event);

        expect(counter.textContent).to.equal("5");
    });
});