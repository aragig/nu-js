//------------------------------------------------------------------------------------
// カスタムアラート
//------------------------------------------------------------------------------------
(function () {
    function showSheet(message, buttons) {
        neoux.__overlay.show();

        const box = document.createElement("div");
        box.className = "nuAlertBox";

        // ボタン数でシートモードを判定
        const isSheetMode = buttons.length >= 3;
        if (isSheetMode) {
            box.classList.add("sheetMode");
        }

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
            if (btn.cancel) button.classList.add("cancel");
            button.textContent = btn.label;

            button.addEventListener("click", () => {
                neoux.__overlay.hide();
                box.style.opacity = "0";
                setTimeout(() => {
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
        document.body.appendChild(box);

        // フェードイン
        requestAnimationFrame(() => {
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
        neoux.__overlay.show();

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

    function hideLoading() {

        const spinner = document.querySelector(".nuLoadingSpinner");
        const msgBox = document.querySelector(".nuLoadingMessage");

        if (spinner) {
            spinner.style.opacity = "0";
            setTimeout(() => spinner.remove(), 200);
        }

        if (msgBox) {
            msgBox.style.opacity = "0";
            setTimeout(() => msgBox.remove(), 200);
        }

        neoux.__overlay.hide();
    }

    //------------------------------------------------------------------------------------
    // グローバルに公開
    //------------------------------------------------------------------------------------
    window.neoux.loading = {
        show: showLoading,
        hide: hideLoading
    };

})();


//------------------------------------------------------------------------------------
// トースト通知
//------------------------------------------------------------------------------------
(function () {

    function showToast(message, duration = 3000) {
        const toast = document.createElement("div");
        toast.className = "nuToast";
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

    //------------------------------------------------------------------------------------
    // グローバルに公開
    //------------------------------------------------------------------------------------
    window.neoux.toast = {
        show: showToast
    };

})();

//------------------------------------------------------------------------------------
// オーバーレイ制御ユーティリティ
//------------------------------------------------------------------------------------
(function () {
    const overlayClassName = "nuOverlay";

    window.neoux.__overlay = {
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

        hide: function () {
            const overlay = document.querySelector(`.${overlayClassName}`);
            if (!overlay) return;
            overlay.style.opacity = "0";
            setTimeout(() => {
                overlay.remove();
            }, 200);
        },
    };
})();