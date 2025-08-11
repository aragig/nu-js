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
