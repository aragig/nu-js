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
const nu = require("../src/neoux/js/nu.js")


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
		const clicked = [];

		const buttonMap = {
			edit: "編集",
			delete: "削除",
			duplicate: "複製",
			cancel: "キャンセル"
		};

		const callbacks = {
			onEdit: () => clicked.push("編集"),
			onDelete: () => clicked.push("削除"),
			onDuplicate: () => clicked.push("複製"),
			onCancel: () => clicked.push("キャンセル")
		};

		nu.sheet("操作を選んでください", buttonMap, callbacks);

		const buttons = document.querySelectorAll(".nuAlertButton");
		expect(buttons.length).to.equal(Object.keys(buttonMap).length);

		// "複製"ボタンをクリック
		const duplicateBtn = [...buttons].find(btn => btn.textContent === "複製");
		expect(duplicateBtn).to.exist;
		duplicateBtn.click();

		setTimeout(() => {
			expect(clicked).to.include("複製");
			expect(document.querySelector(".nuSheetBox")).to.be.null;
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
// テスト: トースト通知
//------------------------------------------------------------------------------------
describe("nu.toast", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
	});

	it("toastがDOMに追加される", (done) => {
		nu.toast("テストメッセージ", {duration: 1000}); // 1秒表示

		const toast = document.querySelector(".nuToast");
		expect(toast).to.exist;
		expect(toast.textContent).to.equal("テストメッセージ");

		// アニメーション適用を待つ
		requestAnimationFrame(() => {
			expect(toast.style.opacity).to.equal("1");
			done();
		});
	});

	it("一定時間後にtoastが消える", (done) => {
		nu.toast("消えるテスト", {duration: 500}); // 0.5秒表示

		setTimeout(() => {
			const toast = document.querySelector(".nuToast");
			expect(toast).to.be.null;
			done();
		}, 800); // 500ms + α（アニメーション猶予）
	});

	// nu.toast - カラータイプ付き
	it("type: success のとき nuToast_SUCCESS が付与される", () => {
		nu.toast("成功メッセージ", { type: "success", duration: 100 });

		const toast = document.querySelector(".nuToast");
		expect(toast).to.exist;
		expect(toast.classList.contains("nuToast_SUCCESS")).to.be.true;
	});

	it("type: error のとき nuToast_ERROR が付与される", () => {
		nu.toast("エラーメッセージ", { type: "error", duration: 100 });

		const toast = document.querySelector(".nuToast");
		expect(toast).to.exist;
		expect(toast.classList.contains("nuToast_ERROR")).to.be.true;
	});

	it("type: warning のとき nuToast_WARNING が付与される", () => {
		nu.toast("警告メッセージ", { type: "warning", duration: 100 });

		const toast = document.querySelector(".nuToast");
		expect(toast).to.exist;
		expect(toast.classList.contains("nuToast_WARNING")).to.be.true;
	});

	it("type: info のとき nuToast_INFO が付与される", () => {
		nu.toast("情報メッセージ", { type: "info", duration: 100 });

		const toast = document.querySelector(".nuToast");
		expect(toast).to.exist;
		expect(toast.classList.contains("nuToast_INFO")).to.be.true;
	});

	it("type未指定時は nuToast_DEFAULT が付与される", () => {
		nu.toast("デフォルトメッセージ", { duration: 100 });

		const toast = document.querySelector(".nuToast");
		expect(toast).to.exist;
		expect(toast.classList.contains("nuToast_DEFAULT")).to.be.true;
	});

	// nu.toast position指定のテスト
	it("position: 'top' を指定すると nuToast_TOP クラスが付く", () => {
		nu.toast("上部トースト", { position: "top", duration: 1000 });

		const toast = document.querySelector(".nuToast");
		expect(toast.classList.contains("nuToast_TOP")).to.be.true;
	});

	it("position: 'bottom' を指定すると nuToast_BOTTOM クラスが付く", () => {
		nu.toast("下部トースト", { position: "bottom", duration: 1000 });

		const toast = document.querySelector(".nuToast");
		expect(toast.classList.contains("nuToast_BOTTOM")).to.be.true;
	});

	it("position未指定の場合はデフォルトでnuToast_BOTTOMクラスが付く", () => {
		nu.toast("デフォルト位置トースト", { duration: 1000 });

		const toast = document.querySelector(".nuToast");
		expect(toast.classList.contains("nuToast_BOTTOM")).to.be.true;
	});

	it("typeとpositionを両方指定したとき、両方のクラスが付与される", () => {
		nu.toast("error-top toast", { type: "error", position: "top", duration: 1000 });

		const toast = document.querySelector(".nuToast");
		expect(toast.classList.contains("nuToast_ERROR")).to.be.true;
		expect(toast.classList.contains("nuToast_TOP")).to.be.true;
	});

	// ショートカット関数
	it("nu.toast.s は success トーストを表示する", () => {
		nu.toast.s("成功", { duration: 100 });

		const toast = document.querySelector(".nuToast");
		expect(toast).to.exist;
		expect(toast.classList.contains("nuToast_SUCCESS")).to.be.true;
		expect(toast.textContent).to.equal("成功");
	});

	it("nu.toast.e は error トーストを表示する", () => {
		nu.toast.e("エラー", { duration: 100 });

		const toast = document.querySelector(".nuToast");
		expect(toast).to.exist;
		expect(toast.classList.contains("nuToast_ERROR")).to.be.true;
		expect(toast.textContent).to.equal("エラー");
	});

	it("nu.toast.w は warning トーストを表示する", () => {
		nu.toast.w("警告", { duration: 100 });

		const toast = document.querySelector(".nuToast");
		expect(toast).to.exist;
		expect(toast.classList.contains("nuToast_WARNING")).to.be.true;
		expect(toast.textContent).to.equal("警告");
	});

	it("nu.toast.i は info トーストを表示する", () => {
		nu.toast.i("情報", { duration: 100 });

		const toast = document.querySelector(".nuToast");
		expect(toast).to.exist;
		expect(toast.classList.contains("nuToast_INFO")).to.be.true;
		expect(toast.textContent).to.equal("情報");
	});

});


//------------------------------------------------------------------------------------
// テスト: ドロップダウンメニュー
//------------------------------------------------------------------------------------
describe("nu.dropdown", () => {
	beforeEach(() => {
		document.body.innerHTML = `
            <button id="testDropdownBtn">メニュー</button>
        `;
	});

	it("ドロップダウンメニューの正常動作", () => {
		let calledItem = null;

		nu.dropdown("testDropdownBtn", {
			foo: "項目1",
			bar: "項目2"
		}, {
			onFoo: () => calledItem = "foo",
			onBar: () => calledItem = "bar"
		});

		document.getElementById("testDropdownBtn").click();

		const dropdown = document.querySelector(".nuDropdownMenu");
		expect(dropdown).to.exist;

		const items = dropdown.querySelectorAll(".nuDropdownItem");
		expect(items.length).to.equal(2);
		expect(items[0].textContent).to.equal("項目1");
		expect(items[1].textContent).to.equal("項目2");

		// simulate click
		items[1].click();
		expect(calledItem).to.equal("bar");

		// dropdown should be removed after click
		expect(document.querySelector(".nuDropdownMenu")).to.be.null;
	});

	it("存在しないボタンIDを指定した場合はエラーにならない", () => {
		expect(() => {
			nu.dropdown("notExistBtn", { foo: "foo" }, { onFoo: () => {} });
		}).to.not.throw();
	});

	it("2回目の表示では1回目のインスタンスが使われないことを確認", () => {
		nu.dropdown("testDropdownBtn", {
			foo: "一番"
		}, {
			onFoo: () => {}
		});

		// 初回クリック → 表示
		document.getElementById("testDropdownBtn").click();
		const first = document.querySelector(".nuDropdownMenu");
		expect(first).to.exist;

		// 再クリック → 前のが削除されて新たに作成される
		document.getElementById("testDropdownBtn").click();
		const second = document.querySelector(".nuDropdownMenu");
		expect(second).to.exist;
		expect(second).to.not.equal(first); // 別インスタンス
	});
});


//------------------------------------------------------------------------------------
// テスト: セグメントボタン
//------------------------------------------------------------------------------------
describe("nu.segment", () => {
	beforeEach(() => {
		document.body.innerHTML = `<div id="testSegmentArea"></div>`;
	});

	it("セグメントボタンが正しくレンダリングされる", () => {
		const config = {
			name: "testOption",
			value: "b",
			options: [
				{ label: "A", value: "a" },
				{ label: "B", value: "b" },
				{ label: "C", value: "c" }
			]
		};

		nu.segment("testSegmentArea", config, () => {});

		const container = document.querySelector("#testSegmentArea_segment");
		expect(container).to.exist;
		expect(container.className).to.equal("nuSegment");

		const radios = container.querySelectorAll('input[type="radio"]');
		const labels = container.querySelectorAll('label');

		expect(radios.length).to.equal(3);
		expect(labels.length).to.equal(3);

		expect(radios[1].checked).to.be.true;
		expect(labels[1].textContent).to.equal("B");
	});

	it("ラジオボタンの選択時にコールバックが呼ばれる", () => {
		let selectedValue = null;

		const config = {
			name: "fruitOption",
			value: "banana",
			options: [
				{ label: "Apple", value: "apple" },
				{ label: "Banana", value: "banana" },
				{ label: "Melon", value: "melon" }
			]
		};

		nu.segment("testSegmentArea", config, (val) => {
			selectedValue = val;
		});

		const input = document.querySelector('input[value="melon"]');
		input.checked = true;

		const event = new window.Event("change", { bubbles: true });
		input.dispatchEvent(event);

		expect(selectedValue).to.equal("melon");
	});
});


//------------------------------------------------------------------------------------
// テスト: 検索ボックス
//------------------------------------------------------------------------------------
describe("nu.search", () => {
	const mockData = {
		"りんご": { article: { title: "りんごのレシピ", url: "/apple.html" } },
		"バナナ": { article: { title: "バナナのレシピ", url: "/banana.html" } },
		"メロン": { article: { title: "メロンのレシピ", url: "/melon.html" } }
	};

	beforeEach(() => {
		document.body.innerHTML = `<div id="testSearchArea"></div>`;
		// fetch をモックする
		global.fetch = () =>
			Promise.resolve({
				json: () => Promise.resolve(mockData)
			});
	});

	afterEach(() => {
		delete global.fetch;
	});

	it("DOMに検索UIが追加される", (done) => {
		nu.search("testSearchArea", "/dummy.json");

		const container = document.querySelector("#testSearchArea .nuSearchContainer");
		const input = document.querySelector("#nuSearchBox");
		const result = document.querySelector("#searchResults");

		expect(container).to.exist;
		expect(input).to.exist;
		expect(result).to.exist;
		done();
	});

	it("onConfirmが呼ばれる", (done) => {
		let calledText = null;

		nu.search("testSearchArea", "/dummy.json", {
			onConfirm: (text) => {
				calledText = text;
			}
		});

		const input = document.querySelector("#nuSearchBox");

		// 疑似イベント: フォーカスでfetch実行 → その後 Enter キー押下
		input.dispatchEvent(new window.Event("focus"));
		setTimeout(() => {
			input.value = "りんご";
			const event = new window.KeyboardEvent("keydown", {
				key: "Enter"
			});
			input.dispatchEvent(event);

			setTimeout(() => {
				expect(calledText).to.equal("りんご");
				done();
			}, 10);
		}, 10);
	});

	it("入力に対して一致するリンクが生成される", (done) => {
		nu.search("testSearchArea", "/dummy.json");

		const input = document.querySelector("#nuSearchBox");

		// 初期データ取得
		input.dispatchEvent(new window.Event("focus"));

		setTimeout(() => {
			input.value = "バナナ";
			input.dispatchEvent(new window.Event("input"));

			setTimeout(() => {
				const links = document.querySelectorAll("#searchResults a");
				expect(links.length).to.equal(1);
				expect(links[0].textContent).to.equal("バナナのレシピ");
				expect(links[0].href).to.contain("/banana.html");
				done();
			}, 10);
		}, 10);
	});

	it("一致しない場合に『該当する記事がありません』と表示される", (done) => {
		nu.search("testSearchArea", "/dummy.json");

		const input = document.querySelector("#nuSearchBox");

		input.dispatchEvent(new window.Event("focus"));

		setTimeout(() => {
			input.value = "存在しないワード";
			input.dispatchEvent(new window.Event("input"));

			setTimeout(() => {
				const result = document.querySelector("#searchResults");
				expect(result.textContent).to.contain("該当する記事がありません");
				done();
			}, 10);
		}, 10);
	});
});



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