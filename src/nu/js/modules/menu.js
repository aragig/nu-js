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
