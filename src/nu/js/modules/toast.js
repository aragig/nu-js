;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};


	//------------------------------------------------------------------------------------
	// トースト通知
	//------------------------------------------------------------------------------------


	/**
	 * トースト通知を表示する
	 * @param {string} message - 表示するメッセージ
	 * @param {Object} [options] - 表示オプション（省略可）
	 * @param {number} [options.duration=5000] - 表示時間（ミリ秒）
	 * @param {string} [options.type="default"] - スタイルタイプ: "success" | "error" | "warning" | "info"
	 * @param {string} [options.position="bottom"] - スタイルタイプ: "top" | "bottom"
	 */
	nu.toast = function showToast(message, options = {}) {
		const duration = options.duration ?? 5000;
		const type = options.type ?? "default";
		const position = options.position ?? "bottom";

		const toast = document.createElement("div");
		toast.className = "nuToast";
		toast.classList.add(`nuToast_${type.toUpperCase()}`);
		toast.classList.add(`nuToast_${position.toUpperCase()}`);

		toast.textContent = message;

		// Y方向のアニメーションだけJSで制御（X方向はCSSで吸収）
		let initialTransformY = "translateY(0)";
		let exitTransformY = "translateY(0)";
		if (position === "top") {
			initialTransformY = "translateY(-20px)";
			exitTransformY = "translateY(-20px)";
		} else if (position === "bottom") {
			initialTransformY = "translateY(20px)";
			exitTransformY = "translateY(20px)";
		}

		toast.style.opacity = "0";
		toast.style.transform = initialTransformY;

		document.body.appendChild(toast);

		// 表示トリガー（アニメーション）
		requestAnimationFrame(() => {
			toast.style.opacity = "1";
			toast.style.transform = `translateY(0)`;
		});

		// 一定時間後に非表示
		setTimeout(() => {
			toast.style.opacity = "0";
			toast.style.transform = exitTransformY;
			setTimeout(() => toast.remove(), 200);
		}, duration);
	}
	//------------------------------------------------------------------------------------
	// ショートカット関数（type固定）
	//------------------------------------------------------------------------------------
	nu.toast.s = function (message, options = {}) {
		options.type = "success";
		nu.toast(message, options);
	};

	nu.toast.e = function (message, options = {}) {
		options.type = "error";
		nu.toast(message, options);
	};

	nu.toast.w = function (message, options = {}) {
		options.type = "warning";
		nu.toast(message, options);
	};

	nu.toast.i = function (message, options = {}) {
		options.type = "info";
		nu.toast(message, options);
	};
})(window);
