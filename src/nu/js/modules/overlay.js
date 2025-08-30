;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};


	//TODO オーバーレイをクリックしたら閉じたい場合もあるため、コールバックを実装する
	//------------------------------------------------------------------------------------
	// オーバーレイ制御ユーティリティ
	//------------------------------------------------------------------------------------
	const overlayClassName = "nuOverlay";
	const defaultTimeout = 200; // 外部からもアクセス可能にするための初期値

	const overlayStack = [];

	nu.overlay = {
		show: function () {
			const overlay = document.createElement("div");
			overlay.className = overlayClassName;
			overlay.style.opacity = "0";
			document.body.appendChild(overlay);

			// スタックに積む（引数なしhide時は最後に出したものから閉じる）
			overlayStack.push(overlay);

			requestAnimationFrame(() => {
				overlay.style.opacity = "1";
			});

			return overlay;
		},

		hide: async function (targetOverlay) {
			let overlay = targetOverlay;

			if (!overlay) {
				// DOM上の最後の .nuOverlay を拾う（stackが壊れても最後の実体を閉じられる保険）
				if (overlayStack.length > 0) {
					overlay = overlayStack.pop();
					// 既にDOMから消えている可能性もあるので補助探索
					if (!overlay || !overlay.isConnected) {
						const list = document.querySelectorAll(`.${overlayClassName}`);
						overlay = list[list.length - 1] || null;
					}
				} else {
					const list = document.querySelectorAll(`.${overlayClassName}`);
					overlay = list[list.length - 1] || null;
				}
			}
			if (!overlay) return false;

			// スタックからも確実に取り除く
			const idx = overlayStack.indexOf(overlay);
			if (idx !== -1) overlayStack.splice(idx, 1);

			overlay.style.opacity = "0";
			await new Promise(resolve => setTimeout(resolve, defaultTimeout));

			// 既に他のロジックで消されている可能性もあるため防御
			if (overlay && overlay.parentNode) {
				overlay.remove();
			}
			return true;
		},
		timeout: defaultTimeout
	};

})(window);
