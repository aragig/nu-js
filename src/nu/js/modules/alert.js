;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};


	//------------------------------------------------------------------------------------
	// カスタムアラート
	//------------------------------------------------------------------------------------

	window.nu.alert = function (message, onOk) {
		showSheet(message, { ok: "OK" }, {onOk: onOk});
	};
	window.nu.confirm = function (message, onOk, onCancel) {
		showSheet(message, { cancel: "キャンセル", ok: "OK" }, {
			onOk: onOk,
			onCancel: onCancel
		});
	};
	window.nu.sheet = function (message, buttons, callbacks) {
		showSheet(message, buttons, callbacks);
	};


	//--- 以下は private メソッド

	/**
	 * @private
	 * @param {string} message
	 * @param {Array.<Object>} buttonMap - ボタンアイテム
	 * @param {Object} [handlers] - オプションのコールバック関数
	 */
	function showSheet(message, buttonMap, handlers) {
		window.nu.overlay.show();

		// ボタンにコールバックを登録
		const buttons = [];
		for (let key in buttonMap) {
			const label = buttonMap[key];
			const handlerName = "on" + key[0].toUpperCase() + key.slice(1);
			const callback = handlers?.[handlerName];
			const btnClassName = key.toUpperCase();

			buttons.push({ label, callback, btnClassName });
		}

		const box = document.createElement("div");

		// ボタン数でシートモードを判定
		const isSheetMode = buttons.length >= 3;
		box.className = isSheetMode ? "nuSheetBox" : "nuAlertBox";

		box.style.opacity = "0";

		const msg = document.createElement("div");
		msg.className = "nuAlertMessage";
		// msg.textContent = message;
		msg.innerHTML = message;

		const buttonRow = document.createElement("div");
		buttonRow.className = "nuAlertButtonRow";

		buttons.forEach(btn => {
			const button = document.createElement("button");
			button.className = "nuAlertButton";

			// キーに応じたクラス名を付ける
			if (btn.btnClassName) {
				button.classList.add(`nuAlertButton_${btn.btnClassName}`); // プレフィックス付きが無難
			}

			button.textContent = btn.label;

			button.addEventListener("click", async () => {
				if (typeof btn.callback === "function") {
					btn.callback();
				}

				box.style.opacity = "0";
				// オーバーレイを非表示 → 完了を待ってからボックス削除
				await window.nu.overlay.hide();
				document.body.removeChild(box);
			});

			buttonRow.appendChild(button);
		});

		box.appendChild(msg);
		box.appendChild(buttonRow);
		document.body.appendChild(box);

		// フェードイン
		requestAnimationFrame(() => {
			box.style.opacity = "1";
		});
	}



})(window);
