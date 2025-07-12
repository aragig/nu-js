//------------------------------------------------------------------------------------
// カスタムアラート
//------------------------------------------------------------------------------------
(function() {

    //------------------------------------------------------------------------------------
    // プライベート関数
    //------------------------------------------------------------------------------------

    // スタイル定義
    const modalCss = `
    .customAlertOverlay {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9998;
    }
    .customAlertBox {
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 9999;
        max-width: 90%;
        font-family: sans-serif;
        text-align: center;
    }
    .customAlertMessage {
        margin-bottom: 20px;
        font-size: 16px;
    }
    .customAlertButtonRow {
      display: flex;
      justify-content: center;
      gap: 20px;
    }
    .customAlertButton {
      padding: 8px 16px;
      background: #007AFF; /* iOSブルー */
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      min-width: 70px;
    }
    .customAlertButton.cancel {
      background: #aaa;
    }
  `;

    // head に style を追加
    const styleTag = document.createElement("style");
    styleTag.innerHTML = modalCss;
    document.head.appendChild(styleTag);


    function showAlert(type, message, onOk, onCancel) {

        // DOM生成
        const overlay = document.createElement("div");
        overlay.className = "customAlertOverlay";

        const box = document.createElement("div");
        box.className = "customAlertBox";

        const msg = document.createElement("div");
        msg.className = "customAlertMessage";
        msg.textContent = message;

        const buttonRow = document.createElement("div");
        buttonRow.className = "customAlertButtonRow";


        if (type === "alert") {
            const okBtn = document.createElement("button");
            okBtn.className = "customAlertButton";
            okBtn.textContent = "OK";

            okBtn.addEventListener("click", () => {
                closeModal(onOk, true);
            });

            buttonRow.appendChild(okBtn);
        } else if (type === "confirm") {
            const cancelBtn = document.createElement("button");
            cancelBtn.className = "customAlertButton cancel";
            cancelBtn.textContent = "キャンセル";

            const okBtn = document.createElement("button");
            okBtn.className = "customAlertButton";
            okBtn.textContent = "OK";

            cancelBtn.addEventListener("click", () => {
                closeModal(onCancel, false);
            });
            okBtn.addEventListener("click", () => {
                closeModal(onOk, true);
            });

            buttonRow.appendChild(cancelBtn);
            buttonRow.appendChild(okBtn);
        }

        box.appendChild(msg);
        box.appendChild(buttonRow);
        document.body.appendChild(overlay);
        document.body.appendChild(box);

        // アニメーション表示
        requestAnimationFrame(() => {
            overlay.style.opacity = "1";
            box.style.opacity = "1";
        });

        function closeModal(cb, result) {
            overlay.style.opacity = "0";
            box.style.opacity = "0";
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.body.removeChild(box);
                if (typeof cb === "function") {
                    cb(result);
                }
            }, 200);
        }
    }

    //------------------------------------------------------------------------------------
    // グローバルに公開
    //------------------------------------------------------------------------------------
    window.neoux = {
        alert: function (message, onOk) {
            showAlert("alert", message, onOk, null);
        },
        confirm: function (message, onOk, onCancel) {
            showAlert("confirm", message, onOk, onCancel);
        },
    };

})();