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

		// すでに生成済みなら再利用（シングルトン化）
		let spinner = document.querySelector(".nuLoadingSpinner");
		let msgBox  = document.querySelector(".nuLoadingMessage");

		if (!spinner) {
			// スピナー
			spinner = document.createElement("div");
			spinner.className = "nuLoadingSpinner";
			document.body.appendChild(spinner);
		}
		if (!msgBox) {
			// メッセージ（省略可能）
			msgBox = document.createElement("div");
			msgBox.className = "nuLoadingMessage";
			document.body.appendChild(msgBox);
		}

		// メッセージ更新
		msgBox.textContent = message || "";

		// フェードイン
		requestAnimationFrame(() => {
			spinner.style.opacity = "1";
			msgBox.style.opacity = "1";
		});
	}

	async function hideLoading() {

		// 複数存在しても全部フェードアウト
		const els = document.querySelectorAll(".nuLoadingSpinner, .nuLoadingMessage");
		els.forEach(el => { el.style.opacity = "0"; });

		await window.nu.overlay.hide();

		// 全部削除
		els.forEach(el => { el.remove(); });
	}

})(window);
