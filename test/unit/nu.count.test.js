require('../setup');


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