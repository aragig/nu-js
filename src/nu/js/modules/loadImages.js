;(function (global) {
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