;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};

	//------------------------------------------------------------------------------------
	// アコーディオン（開閉パネル）
	//------------------------------------------------------------------------------------

	/**
	 * アコーディオンを有効化する
	 * @param {string} selector - 対象のセレクタ（id/classなど）
	 */
	nu.accordion = function(selector) {
		const items = document.querySelectorAll(selector);
		if (!items.length) return;

		items.forEach(item => {
			const header = item.querySelector(".nuAccordionHeader");
			const content = item.querySelector(".nuAccordionContent");

			if (!header || !content) return;

			// 初期状態
			content.style.display = "none";

			header.addEventListener("click", () => {
				// #7 アコーディオンを開くと全選択状態になってしまう対処 (2025/08/10 T.Arai)
				window.getSelection()?.removeAllRanges();

				const isOpen = content.style.display === "block";
				content.style.display = isOpen ? "none" : "block";
			});
		});
	};

})(window);
