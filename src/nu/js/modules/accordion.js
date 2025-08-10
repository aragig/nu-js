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

			// ---- 初期状態をdata属性から判定 (#11 T.Arai 2025/08/10 added.) --------
			// data-initial="open" | "closed"（未指定はclosed）
			const initial = (item.dataset.initial || "").toLowerCase();
			let isOpen = initial === "open";

			// 初期状態
			content.style.display = isOpen ? "block" : "none";
			item.classList.toggle("isOpen", isOpen);
			// ----------------------------------------------------------------------


			header.addEventListener("click", () => {
				// #7 アコーディオンを開くと全選択状態になってしまう対処 (2025/08/10 T.Arai)
				window.getSelection()?.removeAllRanges();

				const isOpen = content.style.display === "block";
				content.style.display = isOpen ? "none" : "block";
			});
		});
	};

})(window);
