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
