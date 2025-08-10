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

