//------------------------------------------------------------------------------------
// カスタムアラート
//------------------------------------------------------------------------------------
(function () {
    function showSheet(message, buttons) {
        const overlay = document.createElement("div");
        overlay.className = "customAlertOverlay";
        overlay.style.opacity = "0";

        const box = document.createElement("div");
        box.className = "customAlertBox";

        // ボタン数でシートモードを判定
        const isSheetMode = buttons.length >= 3;
        if (isSheetMode) {
            box.classList.add("sheetMode");
        }

        box.style.opacity = "0";

        const msg = document.createElement("div");
        msg.className = "customAlertMessage";
        // msg.textContent = message;
        msg.innerHTML = message;

        const buttonRow = document.createElement("div");
        buttonRow.className = "customAlertButtonRow";

        buttons.forEach(btn => {
            const button = document.createElement("button");
            button.className = "customAlertButton";
            if (btn.cancel) button.classList.add("cancel");
            button.textContent = btn.label;

            button.addEventListener("click", () => {
                overlay.style.opacity = "0";
                box.style.opacity = "0";
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    document.body.removeChild(box);
                    if (typeof btn.callback === "function") {
                        btn.callback();
                    }
                }, 200);
            });

            buttonRow.appendChild(button);
        });

        box.appendChild(msg);
        box.appendChild(buttonRow);
        document.body.appendChild(overlay);
        document.body.appendChild(box);

        // フェードイン
        requestAnimationFrame(() => {
            overlay.style.opacity = "1";
            box.style.opacity = "1";
        });
    }

    //------------------------------------------------------------------------------------
    // グローバルに公開
    //------------------------------------------------------------------------------------
    window.neoux = {
        // 使いやすいようにラッパーする
        alert: function (message, onOk) {
            showSheet(message, [
                { label: "OK", callback: () => onOk?.() }
            ]);
        },
        // 使いやすいようにラッパーする
        confirm: function (message, onOk, onCancel) {
            showSheet(message, [
                { label: "キャンセル", cancel: true, callback: () => onCancel?.() },
                { label: "OK", callback: () => onOk?.() }
            ]);
        },
        sheet: function (message, buttons) {
            showSheet(message, buttons);
        }
    };

})();


//------------------------------------------------------------------------------------
// ローディングインジケータ
//------------------------------------------------------------------------------------
(function () {

    function showLoading(message) {
        // オーバーレイ
        const overlay = document.createElement("div");
        overlay.className = "customAlertOverlay";
        overlay.style.opacity = "0";

        // スピナー
        const spinner = document.createElement("div");
        spinner.className = "loadingSpinner";

        // メッセージ（省略可能）
        const msgBox = document.createElement("div");
        msgBox.className = "loadingMessage";
        msgBox.textContent = message || "";

        document.body.appendChild(overlay);
        document.body.appendChild(spinner);
        document.body.appendChild(msgBox);

        // フェードイン
        requestAnimationFrame(() => {
            overlay.style.opacity = "1";
            spinner.style.opacity = "1";
            msgBox.style.opacity = "1";
        });
    }

    function hideLoading() {
        const overlay = document.querySelector(".customAlertOverlay");
        const spinner = document.querySelector(".loadingSpinner");
        const msgBox = document.querySelector(".loadingMessage");

        if (spinner) {
            spinner.style.opacity = "0";
            setTimeout(() => {
                spinner.remove();
            }, 200);
        }

        if (msgBox) {
            msgBox.style.opacity = "0";
            setTimeout(() => {
                msgBox.remove();
            }, 200);
        }

        if (overlay) {
            overlay.style.opacity = "0";
            setTimeout(() => {
                overlay.remove();
            }, 200);
        }
    }

    //------------------------------------------------------------------------------------
    // グローバルに公開
    //------------------------------------------------------------------------------------
    window.neoux.loading = {
        show: showLoading,
        hide: hideLoading
    };

})();
