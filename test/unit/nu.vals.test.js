require('../setup');


//------------------------------------------------------------------------------------
// テスト: Submit
//------------------------------------------------------------------------------------
describe("nu.submit.vals", () => {
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
		const values = window.nu.vals("myForm");

		expect(values).to.deep.equal({
			username: "Alice",
			comment: "Hello",
			color: "blue",
			subscribe: true,
			gender: "female"
		});
		done();
	});

	it("targetが不正はエラーにならない", () => {
		expect(() => window.nu.vals(null)).to.not.throw();
	});
});

