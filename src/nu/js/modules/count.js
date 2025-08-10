;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};

	//------------------------------------------------------------------------------------
	// 入力欄に対して文字数カウンターを追加する
	//------------------------------------------------------------------------------------

	/**
	 * 入力欄に対して文字数カウンターを追加する
	 * @param {string} inputId - inputまたはtextareaのid名
	 * @param {number} limit - 文字数制限（例: 30）
	 */
	nu.count = function (inputId, limit) {
		if (!inputId || typeof limit !== "number") return;

		const input = document.getElementById(inputId);
		if (!input) {
			console.warn(`inputId "${inputId}" の要素が見つかりません`);
			return;
		}

		// すでにカウンターが追加済みならスキップ
		const existing = document.getElementById(input.id + "_counter");
		if (existing) return;

		const counter = document.createElement("div");
		counter.id = input.id + "_counter";
		counter.className = "nuCharCounter";

		// inputの直後に挿入（同じ親の中）
		input.insertAdjacentElement("afterend", counter);

		const update = () => {
			const len = input.value.length;
			counter.textContent = len;
			counter.style.color = len > limit ? "red" : "#888";
		};

		input.addEventListener("input", update);
		update(); // 初期表示
	};

})(window);
