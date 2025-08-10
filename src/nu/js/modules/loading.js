;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};


	//------------------------------------------------------------------------------------
	// ローディングインジケータ
	//------------------------------------------------------------------------------------

	if(!nu.loading) nu.loading = {};

	nu.loading.show = showLoading;
	nu.loading.hide = hideLoading;


	//--- 以下は private メソッド

	function showLoading(message) {
		window.nu.overlay.show();

		// スピナー
		const spinner = document.createElement("div");
		spinner.className = "nuLoadingSpinner";

		// メッセージ（省略可能）
		const msgBox = document.createElement("div");
		msgBox.className = "nuLoadingMessage";
		msgBox.textContent = message || "";

		document.body.appendChild(spinner);
		document.body.appendChild(msgBox);

		// フェードイン
		requestAnimationFrame(() => {
			spinner.style.opacity = "1";
			msgBox.style.opacity = "1";
		});
	}

	async function hideLoading() {

		const spinner = document.querySelector(".nuLoadingSpinner");
		const msgBox = document.querySelector(".nuLoadingMessage");
		if (spinner) spinner.style.opacity = "0";
		if (msgBox) msgBox.style.opacity = "0";

		await window.nu.overlay.hide();

		if (spinner) spinner.remove();
		if (msgBox) msgBox.remove();
	}

})(window);
