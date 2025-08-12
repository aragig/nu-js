;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};


	//------------------------------------------------------------------------------------
	// カスタムアラート
	//------------------------------------------------------------------------------------

	nu.alert = function (message, onOk) {
		showSheet(message, { ok: "OK" }, {onOk: onOk});
	};
	nu.confirm = function (message, onOk, onCancel) {
		showSheet(message, { cancel: "キャンセル", ok: "OK" }, {
			onOk: onOk,
			onCancel: onCancel
		});
	};
	nu.sheet = function (message, buttons, callbacks) {
		showSheet(message, buttons, callbacks);
	};

// 入力付きアラート（プロンプト）
	nu.prompt = function (message, options = {}, handlers = {}) {
		const buttons = options.buttons || {
			cancel: options.cancelLabel || "キャンセル",
			ok: options.okLabel || "OK"
		};
		const callbacks = {
			onOk: (val) => handlers.onOk && handlers.onOk(val),
			onCancel: (val) => handlers.onCancel && handlers.onCancel(val)
		};

		showSheet(message, buttons, callbacks, {
			input: true,
			placeholder: options.placeholder,
			value: options.value,
			type: options.type || "text"
		});
	};

	//--- 以下は private メソッド

	/**
	 * @private
	 * @param {string} message
	 * @param {Array.<Object>} buttonMap - ボタンアイテム
	 * @param {Object} [handlers] - オプションのコールバック関数
	 * @param opts
	 */
	function showSheet(message, buttonMap, handlers, opts = {}) {
		nu.overlay.show();

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

		// ▼▼ 追加：入力欄（必要なときだけ描画） ▼▼
		const hasInput = !!opts.input;
		let inputEl = null;
		if (hasInput) {
			const inputRow = document.createElement("div");
			inputRow.className = "nuAlertInputRow";

			inputEl = document.createElement("input");
			inputEl.type = opts.type || "text";
			inputEl.className = "nuAlertInput";
			if (opts.placeholder) inputEl.placeholder = opts.placeholder;
			if (opts.value != null) inputEl.value = opts.value;

			inputRow.appendChild(inputEl);
			box.appendChild(msg);
			box.appendChild(inputRow);
		} else {
			box.appendChild(msg);
		}
		// ▲▲ 追加ここまで ▲▲

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
					const val = hasInput ? inputEl.value : undefined;
					btn.callback(val);
				}

				box.style.opacity = "0";
				// オーバーレイを非表示 → 完了を待ってからボックス削除
				await nu.overlay.hide();
				document.body.removeChild(box);
			});

			buttonRow.appendChild(button);
		});

		box.appendChild(buttonRow);
		document.body.appendChild(box);

		// フェードイン
		requestAnimationFrame(() => {
			box.style.opacity = "1";
		});
	}



})(window);
