(function () {
    "use strict";

    if(!window.nu) window.nu = {};

    //------------------------------------------------------------------------------------
    // ログユーティリティ
    //------------------------------------------------------------------------------------
    {
        if(!window.nu.d) window.nu.d = {};

        window.nu.d.begin = function (logTitle) {
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

        window.nu.d.log = function (...args) {
            console.log(...args);
        };

        window.nu.d.warn = function (...args) {
            console.warn(...args);
        };

        window.nu.d.error = function (...args) {
            console.error(...args);
        };

        window.nu.d.info = function (...args) {
            console.info(...args);
        };

        window.nu.d.json = function (label, obj) {
            console.groupCollapsed(`%c${label}`, "color: blue; font-weight: bold;");
            console.dir(obj);
            console.groupEnd();
        };

        window.nu.d.table = function (label, obj) {
            console.groupCollapsed(`%c${label}`, "color: green; font-weight: bold;");
            console.table(obj);
            console.groupEnd();
        }

        window.nu.d.end = function () {
            console.groupEnd();
        };
    }

    //------------------------------------------------------------------------------------
    // テストコードのテスト用
    //------------------------------------------------------------------------------------
    {
        window.nu.__example = function (x) {
            return x * 2;
        };
    }

    //TODO オーバーレイをクリックしたら閉じたい場合もあるため、コールバックを実装する
    //------------------------------------------------------------------------------------
    // オーバーレイ制御ユーティリティ
    //------------------------------------------------------------------------------------
    {
        if(!window.nu.overlay) window.nu.overlay = {};

        const overlayClassName = "nuOverlay";
        const defaultTimeout = 200; // 外部からもアクセス可能にするための初期値

        window.nu.overlay = {
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


    //------------------------------------------------------------------------------------
    // カスタムアラート
    //------------------------------------------------------------------------------------
    {

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

        //------------------------------------------------------------------------------------
        // グローバルに公開
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
    }


    //------------------------------------------------------------------------------------
    // ローディングインジケータ
    //------------------------------------------------------------------------------------
    {
        if(!window.nu.loading) window.nu.loading = {};

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

        //------------------------------------------------------------------------------------
        // グローバルに公開
        //------------------------------------------------------------------------------------
        window.nu.loading.show = showLoading;
        window.nu.loading.hide = hideLoading;
    }


    //------------------------------------------------------------------------------------
    // トースト通知
    //------------------------------------------------------------------------------------
    {

        /**
         * トースト通知を表示する
         * @param {string} message - 表示するメッセージ
         * @param {Object} [options] - 表示オプション（省略可）
         * @param {number} [options.duration=5000] - 表示時間（ミリ秒）
         * @param {string} [options.type="default"] - スタイルタイプ: "success" | "error" | "warning" | "info"
         */
        window.nu.toast = function showToast(message, options = {}) {
            const duration = options.duration ?? 5000;
            const type = options.type ?? "default";

            const toast = document.createElement("div");
            toast.className = "nuToast";
            toast.classList.add(`nuToast_${type.toUpperCase()}`);
            toast.textContent = message;

            document.body.appendChild(toast);

            // 表示トリガー（アニメーション）
            requestAnimationFrame(() => {
                toast.style.opacity = "1";
                toast.style.transform = "translateY(0)";
            });

            // 一定時間後に非表示
            setTimeout(() => {
                toast.style.opacity = "0";
                toast.style.transform = "translateY(20px)";
                setTimeout(() => toast.remove(), 200);
            }, duration);
        }

    }


    //------------------------------------------------------------------------------------
    // ドロップダウンメニュー
    //------------------------------------------------------------------------------------
    {
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
            let left = rect.left + window.scrollX;
            if (left + dropdownWidth + margin > window.innerWidth) {
                // はみ出す場合は右寄せ
                left = window.innerWidth - dropdownWidth - margin;
            }

            dropdown.style.top = `${rect.bottom + window.scrollY}px`;
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

        //------------------------------------------------------------------------------------
        // グローバルに公開
        //------------------------------------------------------------------------------------
        // if (!window.nu.dropdown) window.nu.dropdown = {};
        /**
         * メニューボタンにアタッチ
         * @param buttonId - メニューボタンのid名
         * @param {Array.<Object>} menuMap - ドロップダウンアイテム
         * @param {Object} [handlers] - コールバック
         */
        window.nu.dropdown = function (buttonId, menuMap, handlers) {
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

    }

    //------------------------------------------------------------------------------------
    // TODO 欲しいボタン→ UISwitchのようなスイッチ
    //------------------------------------------------------------------------------------


    //------------------------------------------------------------------------------------
    // TODO 欲しいボタン→ ONオフだけでなく3連以上のトグルボタン
    //------------------------------------------------------------------------------------

    //------------------------------------------------------------------------------------
    // セグメントボタン
    //------------------------------------------------------------------------------------
    {
        // if (!window.nu.segment) window.nu.segment = {};
        /**
         * @private
         * segment要素にアタッチ
         * @param {HTMLElement} container - inputとlabelを内包する親div
         * @param {Function} callback - 選択時のコールバック（valueを引数として渡す）
         */
        function segmentAttach(container, callback) {
            const radios = container.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.checked) {
                        callback(radio.value);
                    }
                });
            });
        };

        /**
         * segment要素を生成してDOMに追加
         * @param {string} mountId - 追加先の親要素
         * @param {Object} config - セグメント設定オブジェクト
         * @param {string} config.name - ラジオグループ名
         * @param {Array.<{label: string, value: string}>} config.options - 選択肢の配列
         * @param {string} config.value - 初期選択値
         * @param {Function} callback - 選択時のコールバック（引数: value）
         */
        window.nu.segment = function (mountId, config, callback) {
            const container = document.createElement("div");
            container.className = "nuSegment";
            container.id = mountId + "_segment";

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
            segmentAttach(container, callback);

            // DOMに追加
            document.getElementById(mountId).appendChild(container);
        };
    }


    //------------------------------------------------------------------------------------
    // 検索ボックス
    //------------------------------------------------------------------------------------
    {
        // if (!window.nu.search) window.nu.search = {};
        /**
         * 検索UIを生成し、検索ロジックをバインドする
         * @param {string} areaId - 検索UIを配置するid名
         * @param {string} jsonPath - 検索インデックスJSONのURL
         * @param {Object} [callbacks] - オプションのコールバック関数
         * @param {function(string):void} [callbacks.onConfirm] - 確定入力時の処理
         * @param {function(string):void} [callbacks.onBlur] - フォーカスアウト時の処理
         */
        window.nu.search = function (areaId, jsonPath, callbacks) {
            let container = document.getElementById(areaId);
            if (container.querySelector(".nuSearchContainer")) return;

            // 検索ボックス＋アイコン
            const wrapper = document.createElement("div");
            wrapper.className = "nuSearchContainer";
            wrapper.innerHTML = `
            <svg class="nuSearchIcon" viewBox="0 0 24 24" fill="none">
                <path d="M10 2a8 8 0 015.292 13.708l5 5a1 1 0 01-1.414 1.414l-5-5A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z" fill="currentColor"/>
            </svg>
            <input type="search" class="nuSearchInput" id="nuSearchBox" placeholder="検索" />
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
    }


    //------------------------------------------------------------------------------------
    // Submit
    //------------------------------------------------------------------------------------
    {
        if (!window.nu.submit) window.nu.submit = {};

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


        /**
         * フォームの値を取得し、コールバックに渡す
         * @param {string} formId - 対象のform id名
         * @param {Function} callback - 結果を受け取る関数（formDataを引数に渡す）
         */
        window.nu.submit.values = function (formId, callback) {
            if (!formId || typeof callback !== "function") return;

            const el = document.getElementById(formId);
            if (!el) {
                console.warn(`formId "${formId}" の要素が見つかりません`);
                return;
            }

            const values = getFormValues(document.getElementById(formId));
            callback(values);
        };

    }


    //------------------------------------------------------------------------------------
    // 入力欄に対して文字数カウンターを追加する
    //------------------------------------------------------------------------------------
    {
        /**
         * 入力欄に対して文字数カウンターを追加する
         * @param {string} inputId - inputまたはtextareaのid名
         * @param {number} limit - 文字数制限（例: 30）
         */
        window.nu.count = function (inputId, limit) {
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
    }

})();


if (typeof module !== "undefined") {
    module.exports = window.nu;
}