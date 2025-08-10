;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};


	//TODO オーバーレイをクリックしたら閉じたい場合もあるため、コールバックを実装する
	//------------------------------------------------------------------------------------
	// オーバーレイ制御ユーティリティ
	//------------------------------------------------------------------------------------
	const overlayClassName = "nuOverlay";
	const defaultTimeout = 200; // 外部からもアクセス可能にするための初期値

	nu.overlay = {
		show: function () {
			const overlay = document.createElement("div");
			overlay.className = overlayClassName;
			overlay.style.opacity = "0";
			document.body.appendChild(overlay);

			requestAnimationFrame(() => {
				overlay.style.opacity = "1";
			});

			return overlay;
		},

		hide: async function () {
			const overlay = document.querySelector(`.${overlayClassName}`);
			if (!overlay) return false;

			overlay.style.opacity = "0";
			await new Promise(resolve => setTimeout(resolve, defaultTimeout));
			overlay.remove();
			return true;
		},
		timeout: defaultTimeout
	};

})(window);
