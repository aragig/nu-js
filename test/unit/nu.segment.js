require('../setup');

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

		nu.segment("testSegmentArea", config, {});

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

		nu.segment("testSegmentArea", config, {
			onChange: (val) => selectedValue = val
		});

		const input = document.querySelector('input[value="melon"]');
		input.checked = true;

		const event = new window.Event("change", { bubbles: true });
		input.dispatchEvent(event);

		expect(selectedValue).to.equal("melon");
	});
});

