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

})(window);