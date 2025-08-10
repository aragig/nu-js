require('../setup');


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

		nu.menu("testDropdownBtn", {
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
			nu.menu("notExistBtn", { foo: "foo" }, { onFoo: () => {} });
		}).to.not.throw();
	});

	it("2回目の表示では1回目のインスタンスが使われないことを確認", () => {
		nu.menu("testDropdownBtn", {
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

