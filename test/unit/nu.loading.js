require('../setup');


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


