//------------------------------------------------------------------------------------
// カスタムアラート
//------------------------------------------------------------------------------------
(function () {
    
    //------------------------------------------------------------------------------------
    // 共通表示関数
    //------------------------------------------------------------------------------------
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
        msg.textContent = message;

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
