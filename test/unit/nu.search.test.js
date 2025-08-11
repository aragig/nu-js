require('../setup');


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


