require('../setup');

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


