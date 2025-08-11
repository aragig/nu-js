;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};

	//------------------------------------------------------------------------------------
	// セグメントボタン
	//------------------------------------------------------------------------------------



	/**
	 * segment要素を生成してDOMに追加
	 * @param {string} mountId - 追加先の親要素
	 * @param {Object} config - セグメント設定オブジェクト
	 * @param {string} config.name - ラジオグループ名
	 * @param {Array.<{label: string, value: string}>} config.options - 選択肢の配列
	 * @param {string} config.value - 初期選択値
	 * @param {Object} [handlers] - 選択時のコールバック（引数: value）
	 */
	nu.segment = function (mountId, config, handlers = {}) {
		const container = document.createElement("div");
		container.className = "nuSegment";
		container.id = mountId + "_segment";

		let currentValue = config.value;

		config.options.forEach(opt => {
			const inputId = `${container.id}_${opt.value}`;

			const input = document.createElement("input");
			input.type = "radio";
			input.name = config.name;
			input.id = inputId;
			input.value = opt.value;
			if (opt.value === config.value) input.checked = true;

			const label = document.createElement("label");
			label.setAttribute("for", inputId);
			label.textContent = opt.label;

			container.appendChild(input);
			container.appendChild(label);
		});

		// コールバックバインド
		const radios = container.querySelectorAll('input[type="radio"]');
		radios.forEach(radio => {
			radio.addEventListener('change', () => {
				if (radio.checked && radio.value !== currentValue) {
					currentValue = radio.value;
					if (typeof handlers.onChange === "function") {
						handlers.onChange(currentValue);
					}
				}
			});
		});

		// DOMに追加
		document.getElementById(mountId).appendChild(container);
	};

})(window);
