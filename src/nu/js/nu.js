;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};



	//------------------------------------------------------------------------------------
	// ログユーティリティ
	//------------------------------------------------------------------------------------
	{
		if(!nu.d) nu.d = {};

		nu.d.begin = function (logTitle) {
			const logStyles = [
				"background: linear-gradient(to right, #2c3e50, #4ca1af)",
				"border: 1px solid #fff",
				"color: #fff",
				"font-weight: bold",
				"padding: 6px 12px",
				"font-size: 1rem",
				"border-radius: 4px",
				"box-shadow: 0 2px 6px rgba(0,0,0,0.2)"
			].join(";");
			console.group(`%c${logTitle}`, logStyles);
		};

		nu.d.log = function (...args) {
			console.log(...args);
		};

		nu.d.warn = function (...args) {
			console.warn(...args);
		};

		nu.d.error = function (...args) {
			console.error(...args);
		};

		nu.d.info = function (...args) {
			console.info(...args);
		};

		nu.d.json = function (label, obj) {
			console.groupCollapsed(`%c${label}`, "color: blue; font-weight: bold;");
			console.dir(obj);
			console.groupEnd();
		};

		nu.d.table = function (label, obj) {
			console.groupCollapsed(`%c${label}`, "color: green; font-weight: bold;");
			console.table(obj);
			console.groupEnd();
		}

		nu.d.end = function () {
			console.groupEnd();
		};
	}

})(window);

// 以下定義は、単体テストで必要
if (typeof module !== "undefined") {
	module.exports = window.nu;
}
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
				const isOpen = content.style.display === "block";
				content.style.display = isOpen ? "none" : "block";
			});
		});
	};

})(window);
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
;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};

	//------------------------------------------------------------------------------------
	// 編集可能なセル
	//------------------------------------------------------------------------------------

	/**
	 * 編集可能セル機能
	 * @param {Function} [onEdited] - 編集終了時のコールバック（引数: newValue, oldValue, td要素）
	 */
	nu.editable = function (onEdited) {
		const elements = document.querySelectorAll(".nuEditable");

		elements.forEach(el => {
			el.addEventListener("click", function handleClick() {
				const oldValue = this.textContent.trim();
				const originalTag = this.tagName.toLowerCase(); // td, div, etc.
				const originalClasses = this.className;         // クラスも維持
				const originalAttributes = [...this.attributes];

				// input要素
				const input = document.createElement("input");
				input.type = "text";
				input.value = oldValue;
				input.className = "nuInput";
				input.style.marginRight = "6px";

				// 保存ボタン
				const saveBtn = document.createElement("button");
				saveBtn.type = "button";
				saveBtn.className = "nuButton";
				saveBtn.textContent = "保存";

				// ラッパー
				const wrapper = document.createElement("div");
				wrapper.className = "nuEditWrapper flexRow";
				wrapper.appendChild(input);
				wrapper.appendChild(saveBtn);

				this.replaceWith(wrapper);
				input.focus();

				saveBtn.addEventListener("click", () => {
					const newValue = input.value.trim();
					const replacement = document.createElement(originalTag);
					replacement.className = originalClasses;
					replacement.textContent = newValue || oldValue;
					originalAttributes.forEach(attr => {
						if (attr.name !== "class") {
							replacement.setAttribute(attr.name, attr.value);
						}
					});

					replacement.addEventListener("click", handleClick);
					wrapper.replaceWith(replacement);

					if (newValue !== oldValue && typeof onEdited === "function") {
						onEdited(newValue, oldValue, replacement);
					}
				});
			});
		});
	};

})(window);;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};

	//------------------------------------------------------------------------------------
	// 画像一覧取得・表示
	//------------------------------------------------------------------------------------

	nu.loadImages = async function (mountId, options = {}, handlers) {
		const grid = document.getElementById(mountId);
		if (!grid) { nu.toast.e(`要素 ${mountId} が存在しません`); return; }

		// 既存表示を一旦クリアし、ローディング表示
		grid.innerHTML = "";
		const loading = document.createElement("div");
		loading.className = "imgLoading";
		loading.textContent = "画像を読み込んでいます…";
		grid.appendChild(loading);

		// サーバーから画像リストを取得
		try {
			if (!options.endpoint) throw new Error('endpointが未設定です！');

			const res = await fetch(options.endpoint, {
				method: "GET",
				headers: { "Accept": "application/json" },
				credentials: "same-origin" // 同一オリジンであればcookieを送る
			});

			if (!res.ok) { throw new Error("HTTP " + res.status); }

			const imgPaths = await res.json();
			renderImages(mountId, imgPaths, handlers.onTapped);

		} catch (err) {
			handlers.onError(`${err}`);
			grid.innerHTML = "";
			const empty = document.createElement("div");
			empty.className = "imgEmpty";
			empty.textContent = "画像の取得に失敗しました。時間をおいて再試行してください。";
			grid.appendChild(empty);
		}
	}


	//--- 以下はprivateメソッド

	function renderImages(mountId, imgPaths, onTapped) {
		const grid = document.getElementById(mountId);
		grid.innerHTML = "";

		if (!imgPaths || imgPaths.length === 0) {
			const empty = document.createElement("div");
			empty.className = "imgEmpty";
			empty.textContent = "この記事に紐づく画像はまだありません。";
			grid.appendChild(empty);
			return;
		}

		const frag = document.createDocumentFragment();
		for (const path of imgPaths) {
			// ボタンにしておくと、将来的にクリック挙動（Markdown挿入など）を付けやすい
			const item = document.createElement("button");
			item.type = "button";
			item.title = path;

			const img = document.createElement("img");
			img.src = path;
			img.alt = "";

			// 例: 将来ここでクリック挙動（本文へ<img>やMarkdown挿入）を実装可能
			item.addEventListener("click", () => onTapped(path));
			item.appendChild(img);
			frag.appendChild(item);
		}
		grid.appendChild(frag);
	} // renderArticleImages() end.

})(window);
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
;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};


	//------------------------------------------------------------------------------------
	// ドロップダウンメニュー
	//------------------------------------------------------------------------------------

	/**
	 * メニューボタンにアタッチ
	 * @param buttonId - メニューボタンのid名
	 * @param {Array.<Object>} menuMap - ドロップダウンアイテム
	 * @param {Object} [handlers] - コールバック
	 */
	nu.menu = function (buttonId, menuMap, handlers) {
		const buttonElement = document.getElementById(buttonId);
		if (!buttonElement) {
			console.error("ボタンが見つかりません", buttonId);
			return;
		}

		const items = [];
		for (let key in menuMap) {
			const label = menuMap[key];
			const handlerName = "on" + key[0].toUpperCase() + key.slice(1);
			const callback = handlers?.[handlerName];

			items.push({ label, callback });
		}

		buttonElement.addEventListener("click", (e) => {
			e.stopPropagation(); // 外部クリック判定を防ぐ
			// 既に開いているメニューがあれば閉じる
			const existing = document.querySelector(".nuDropdownMenu");
			if (existing) {
				existing.remove();
			}
			createDropdown(buttonElement, items);
		});
	};


	//--- 以下は private メソッド
	function createDropdown(buttonElement, items = []) {
		const dropdown = document.createElement("div");
		dropdown.className = "nuDropdownMenu";

		items.forEach(item => {
			const option = document.createElement("div");
			option.className = "nuDropdownItem";
			option.textContent = item.label;
			option.addEventListener("click", (e) => {
				e.stopPropagation();
				hideDropdown(dropdown);
				if (typeof item.callback === "function") {
					item.callback();
				}
			});
			dropdown.appendChild(option);
		});

		// ボタン位置取得
		const rect = buttonElement.getBoundingClientRect();
		const dropdownWidth = 160; // メニューの最小幅
		const margin = 10;

		// 横位置調整
		let left = rect.left + global.scrollX;
		if (left + dropdownWidth + margin > global.innerWidth) {
			// はみ出す場合は右寄せ
			left = global.innerWidth - dropdownWidth - margin;
		}

		dropdown.style.top = `${rect.bottom + global.scrollY}px`;
		dropdown.style.left = `${left}px`;

		document.body.appendChild(dropdown);

		// 外部クリックで閉じる
		function __outsideClickListener(e) {
			if (!dropdown.contains(e.target) && e.target !== buttonElement) {
				hideDropdown(dropdown);
				document.removeEventListener("click", __outsideClickListener);
			}
		}
		document.addEventListener("click", __outsideClickListener);

		return dropdown;
	}


	function hideDropdown(dropdown) {
		if (dropdown && dropdown.parentNode) {
			dropdown.remove();
		}
	}



})(window);
;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};


	//TODO オーバーレイをクリックしたら閉じたい場合もあるため、コールバックを実装する
	//------------------------------------------------------------------------------------
	// オーバーレイ制御ユーティリティ
	//------------------------------------------------------------------------------------
	{

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
	}


})(window);
;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};

//------------------------------------------------------------------------------------
// 検索ボックス
//------------------------------------------------------------------------------------


	/**
	 * 検索UIを生成し、検索ロジックをバインドする
	 * @param {string} areaId - 検索UIを配置するid名
	 * @param {string} jsonPath - 検索インデックスJSONのURL
	 * @param {Object} [callbacks] - オプションのコールバック関数
	 * @param {function(string):void} [callbacks.onConfirm] - 確定入力時の処理
	 * @param {function(string):void} [callbacks.onBlur] - フォーカスアウト時の処理
	 */
	nu.search = function (areaId, jsonPath, callbacks) {
		let container = document.getElementById(areaId);
		if (container.querySelector(".nuSearchContainer")) return;

		// 検索ボックス＋アイコン
		const wrapper = document.createElement("div");
		wrapper.className = "nuSearchContainer";
		wrapper.innerHTML = `
            <svg class="nuSearchIcon" viewBox="0 0 24 24" fill="none">
                <path d="M10 2a8 8 0 015.292 13.708l5 5a1 1 0 01-1.414 1.414l-5-5A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z" fill="currentColor"/>
            </svg>
            <input type="search" class="nuSearchInput" id="nuSearchBox" placeholder="「/」キー押下で検索" />
        `;

		// 結果表示エリア
		const resultContainer = document.createElement("div");
		resultContainer.id = "searchResults";
		resultContainer.className = "nuSearchResults";

		container.appendChild(wrapper);
		container.appendChild(resultContainer);

		const searchBox = wrapper.querySelector("#nuSearchBox");
		let cachedData = null;
		let isLoaded = false;

		// 初回フォーカスでJSONを取得
		searchBox.addEventListener("focus", function () {
			if (isLoaded) return;

			fetch(jsonPath)
				.then(response => response.json())
				.then(data => {
					cachedData = data;
					isLoaded = true;
				})
				.catch(error => {
					console.error("検索インデックスの読み込みに失敗しました", error);
				});
		});

		// 入力イベント
		searchBox.addEventListener("input", function () {
			const searchText = this.value.toLowerCase();
			resultContainer.innerHTML = "";

			if (!searchText.trim() || !cachedData) return;

			const searchWords = searchText.split(/\s+/);
			let matched = 0;

			Object.keys(cachedData).forEach(word => {
				const keyword = word.toLowerCase();
				const isMatch = searchWords.every(w => keyword.includes(w));

				if (isMatch) {
					const { article } = cachedData[word];
					const title = article.title || word;
					const url = article.url || "#";

					const a = document.createElement("a");
					a.href = url;
					a.target = "_blank";
					a.textContent = title;
					resultContainer.appendChild(a);

					matched++;
				}
			});

			if (matched === 0) {
				const noHit = document.createElement("div");
				noHit.textContent = "該当する記事がありません";
				resultContainer.appendChild(noHit);
			}
		});

		// 検索確定の判定
		let isComposing = false;
		searchBox.addEventListener("compositionstart", () => isComposing = true);
		searchBox.addEventListener("compositionend", () => isComposing = false);

		searchBox.addEventListener("keydown", function (e) {
			if (!isComposing && e.key === "Enter") {
				e.preventDefault();
				const val = this.value.trim();
				if (val && typeof callbacks.onConfirm === "function") {
					callbacks.onConfirm(val);
				}
			}
		});

		// フォーカスが離れたとき
		searchBox.addEventListener("blur", function () {
			const val = this.value.trim();
			if (val && typeof callbacks.onBlur === "function") {
				callbacks.onBlur(val);
			}
		});

		// 「/」キー押下で検索ボックスにフォーカス
		document.addEventListener("keydown", function (event) {
			if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
				event.preventDefault();
				searchBox.scrollIntoView({ behavior: "smooth", block: "center" });
				searchBox.focus();
			}
		});
	};

})(window);

;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};

	//------------------------------------------------------------------------------------
	// セグメントボタン
	//------------------------------------------------------------------------------------



	/**
	 * segment要素を生成してDOMに追加
	 * @param {string} mountId - 追加先の親要素
	 * @param {Object} config - セグメント設定オブジェクト
	 * @param {string} config.name - ラジオグループ名
	 * @param {Array.<{label: string, value: string}>} config.options - 選択肢の配列
	 * @param {string} config.value - 初期選択値
	 * @param {Object} [handlers] - 選択時のコールバック（引数: value）
	 */
	nu.segment = function (mountId, config, handlers = {}) {
		const container = document.createElement("div");
		container.className = "nuSegment";
		container.id = mountId + "_segment";

		let currentValue = config.value;

		config.options.forEach(opt => {
			const inputId = `${container.id}_${opt.value}`;

			const input = document.createElement("input");
			input.type = "radio";
			input.name = config.name;
			input.id = inputId;
			input.value = opt.value;
			if (opt.value === config.value) input.checked = true;

			const label = document.createElement("label");
			label.setAttribute("for", inputId);
			label.textContent = opt.label;

			container.appendChild(input);
			container.appendChild(label);
		});

		// コールバックバインド
		const radios = container.querySelectorAll('input[type="radio"]');
		radios.forEach(radio => {
			radio.addEventListener('change', () => {
				if (radio.checked && radio.value !== currentValue) {
					currentValue = radio.value;
					if (typeof handlers.onChange === "function") {
						handlers.onChange(currentValue);
					}
				}
			});
		});

		// DOMに追加
		document.getElementById(mountId).appendChild(container);
	};

})(window);
;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};

	//------------------------------------------------------------------------------------
	// テーブル行の並び替え（ドラッグアンドドロップ）
	//------------------------------------------------------------------------------------

	/**
	 * テーブル行をドラッグアンドドロップで並び替え可能にする
	 * @param {string} tableId - 対象のtable要素のid
	 * @param {Function} [onReorder] - 並び替え完了時のコールバック（新しい順序の配列を渡す）
	 */
	nu.sortable = function(tableId, onReorder) {
		const table = document.getElementById(tableId);
		if (!table || !table.querySelector("tbody")) return;

		const tbody = table.querySelector("tbody");
		let draggingRow = null;

		const handleDrop = () => {
			if (typeof onReorder === "function") {
				// data-id がセットされればそれを優先して使う
				const newOrder = [...tbody.querySelectorAll("tr")].map(tr => tr.dataset.id || tr.rowIndex);
				onReorder(newOrder);
			}
		};

		// ------------------------------
		// PC用: HTML5 Drag and Drop API
		// ------------------------------
		tbody.querySelectorAll("tr").forEach(row => {
			row.setAttribute("draggable", true);

			row.addEventListener("dragstart", e => {
				draggingRow = row;
				row.classList.add("dragging");
				e.dataTransfer.effectAllowed = "move";
			});

			row.addEventListener("dragend", () => {
				draggingRow = null;
				row.classList.remove("dragging");
			});

			row.addEventListener("dragover", e => {
				e.preventDefault();
				const targetRow = e.currentTarget;
				if (targetRow === draggingRow) return;

				const bounding = targetRow.getBoundingClientRect();
				const offset = e.clientY - bounding.top;

				if (offset > bounding.height / 2) {
					targetRow.after(draggingRow);
				} else {
					targetRow.before(draggingRow);
				}
			});
		});

		tbody.addEventListener("drop", handleDrop);

		// ------------------------------
		// スマホ対応: Touch Events
		// ------------------------------
		let touchStartY = 0;

		tbody.querySelectorAll("tr").forEach(row => {
			row.addEventListener("touchstart", e => {
				draggingRow = row;
				touchStartY = e.touches[0].clientY;
				row.classList.add("dragging");
			});

			row.addEventListener("touchmove", e => {
				e.preventDefault();
				const y = e.touches[0].clientY;
				const overRow = document.elementFromPoint(10, y); // 横方向を固定（左10px）

				if (!overRow || !overRow.closest("tr") || overRow.closest("tr") === draggingRow) return;
				const targetRow = overRow.closest("tr");
				const bounding = targetRow.getBoundingClientRect();
				const offset = y - bounding.top;

				if (offset > bounding.height / 2) {
					targetRow.after(draggingRow);
				} else {
					targetRow.before(draggingRow);
				}
			}, { passive: false });

			row.addEventListener("touchend", () => {
				draggingRow?.classList.remove("dragging");
				handleDrop();
				draggingRow = null;
			});
		});
	};

})(window);
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
;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};

	//------------------------------------------------------------------------------------
	// 画像アップロードUI TODO 画像以外のファイルにも対応したい
	//------------------------------------------------------------------------------------

	/**
	 * @param {string} mountId - 表示領域のID
	 * @param {Object} options - オプション（省略可能）
	 * @param {Object} [handlers] - コールバック
	 */
	nu.upload = function (mountId, options = {}, handlers  ) {
		const mountEl = document.getElementById(mountId);
		if (!mountEl) return;

		// コンテナ作成
		const wrapper = document.createElement("div");
		wrapper.className = "nuUploader";

		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.multiple = true;
		input.className = "nuUploaderInput";

		const dropZone = document.createElement("div");
		dropZone.className = "nuUploaderDropZone";
		dropZone.textContent = "画像をドラッグ＆ドロップ、またはクリックして選択";

		const preview = document.createElement("div");
		preview.className = "nuUploaderPreview";

		// inputとdropZone連携
		dropZone.addEventListener("click", () => input.click());
		input.addEventListener("change", handleFiles);
		dropZone.addEventListener("dragover", e => {
			e.preventDefault();
			dropZone.classList.add("dragOver");
		});
		dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragOver"));
		dropZone.addEventListener("drop", e => {
			e.preventDefault();
			dropZone.classList.remove("dragOver");
			handleFiles({ target: { files: e.dataTransfer.files } });
		});

		// ファイル選択・ドロップ共通処理
		function handleFiles(e) {
			const files = [...e.target.files];
			preview.innerHTML = "";

			files.forEach(file => {
				if (!file.type.startsWith("image/")) return;
				if (options.maxSize && file.size > options.maxSize) {
					handlers.onError(`${file.name} はサイズ制限(${options.maxSize}バイト)を超えています`);
					return;
				}

				const reader = new FileReader();
				reader.onload = () => {
					const img = document.createElement("img");
					img.src = reader.result;
					img.className = "nuUploaderImage";
					preview.appendChild(img);
				};
				reader.readAsDataURL(file);

				// 実際のアップロード処理
				uploadFile(file)
					.then(response => {
						// handlers.onSuccess(`${response}`);
						handlers.onSuccess(`${file.name} をアップロードしました`);
					})
					.catch(err => {
						handlers.onError(`${err}`);
					});
			});
		}

		async function uploadFile(file) {
			if (!options.url) {
				// モックアップロード
				return new Promise(resolve => setTimeout(() => resolve({mock: true}), 500));
			}

			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch(options.url, {
				method: "POST",
				body: formData
			});
			if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
			return await response.json(); // JSONレスポンスを想定
		}

		// DOMに追加
		wrapper.appendChild(input);
		wrapper.appendChild(dropZone);
		wrapper.appendChild(preview);
		mountEl.appendChild(wrapper);
	};
})(window);
;(function (global) {
	"use strict";

	//------------------------------------------------------------------------------------
	// フォームの値を取得
	//------------------------------------------------------------------------------------

	const nu = global.nu = global.nu || {};


	/**
	 * フォームの値を取得し、コールバックに渡す
	 * @param {string} formId - 対象のform id名
	 * @returns {Object} formDataを渡す
	 */
	nu.vals = function (formId) {
		if (!formId) return;

		const el = document.getElementById(formId);
		if (!el) {
			console.warn(`formId "${formId}" の要素が見つかりません`);
			return;
		}

		return getFormValues(document.getElementById(formId));
	};

	//--- 以下は private メソッド
	/**
	 * 指定したフォーム（またはdiv）内のすべての入力値をオブジェクトで取得する
	 * @param {HTMLElement} container - form要素またはdiv要素
	 * @returns {Object} キーがname属性、値がその入力値のオブジェクト
	 */
	function getFormValues(container) {
		const formData = {};
		const elements = container.querySelectorAll('input, select, textarea');

		elements.forEach(el => {
			if (!el.name) return;

			if (el.type === 'checkbox') {
				formData[el.name] = el.checked;
			} else if (el.type === 'radio') {
				if (el.checked) {
					formData[el.name] = el.value;
				}
			} else {
				formData[el.name] = el.value;
			}
		});

		return formData;
	}



})(window);
