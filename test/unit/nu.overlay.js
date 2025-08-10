require('../setup');

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

