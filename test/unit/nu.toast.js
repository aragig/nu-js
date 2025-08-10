require('../setup');


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

