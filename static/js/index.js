document.addEventListener("DOMContentLoaded", () => {
	"use strict";

	//TODO 以下は、実験的なので不要なら削除する
	nu.d.begin("🚀Welcome to nu.js !");
	nu.d.log("ログメッセージ");
	// nu.d.warn("警告メッセージ");
	// nu.d.error("エラーが発生しました");
	// nu.d.info("インフォメーション");
	nu.d.json("jojo.json", {
		"name": "空条承太郎",
		"stand": "ザ・ワールド"
	});

	nu.d.end();

	//------------------------------------------------------------------------------------
	// カスタムアラート もっともシンプル
	//------------------------------------------------------------------------------------
	{
		const code = `
$("#__nuAlertSimple button").click(function() {
	nu.alert("メッセージ");
});
            `.trim();

		$("#__nuAlertSimple pre").text(code); // 表示用
		new Function(code)(); // 実行用
	}

	//------------------------------------------------------------------------------------
	// カスタムアラート　メッセージをHTMLで装飾
	//------------------------------------------------------------------------------------
	{
		const code = `
const message=\`
<b>HTML</b>で装飾できます。<br>
なんと<br>
画像表示も可能！<br>
↓<br>
<a href="https://araisun.com/" target="_blank">
	<img src="https://araisun.com/img/site-logo.jpg">
</a>
\`.trim();

$("#__nuAlert button").click(function() {
	nu.alert(message, function() {
		nu.toast("Clicked OK");
	});
});
            `.trim();

		$("#__nuAlert pre").html(code); // 表示用
		new Function(code)(); // 実行用
	}


	//------------------------------------------------------------------------------------
	// カスタムアラート　二つのボタン --OKとキャンセル
	//------------------------------------------------------------------------------------
	{
		const code = `
$("#__nuConfirm button").click(function() {
	nu.confirm("カスタムアラート", function() {
		nu.toast("Clicked OK");
	}, function() {
		nu.toast("Clicked キャンセル");
	});
});
            `.trim();

		$("#__nuConfirm pre").text(code); // 表示用
		new Function(code)(); // 実行用
	}


	//------------------------------------------------------------------------------------
	// カスタムアラート　二つのボタン --ボタンの名前を自由にカスタマイズ
	//------------------------------------------------------------------------------------
	{
		const code = `
$("#__nuSheetAlert button").click(function() {
	nu.sheet("削除しますがよろしいですか？",
		{cancel:"キャンセル",delete:"削除"},{
			onCancel: function() {
				nu.toast("Clicked キャンセル");
			},
			onDelete: function() {
				nu.toast("Clicked 削除", { type:"error"});
			}
	});
});
            `.trim();

		$("#__nuSheetAlert pre").text(code); // 表示用
		new Function(code)(); // 実行用
	}


	//------------------------------------------------------------------------------------
	// カスタムアラート　３つ以上のボタン --シート表現
	//------------------------------------------------------------------------------------
	{
		const code = `
const items = {
  edit: "編集",
  duplicate: "複製",
  delete: "削除",
  cancel: "キャンセル"
};

$("#__nuSheet button").click(function() {
	nu.sheet("操作を選んでください", items, {
		onEdit: function() {
			nu.toast("clicked 編集")
		},
		onDuplicate: function() {
			nu.toast("clicked 複製")
		},
		onDelete: function() {
			nu.toast("clicked 削除");
		},
		onCancel: function() {
			nu.toast("clicked キャンセル");
		}
	});
});
            `.trim();

		$("#__nuSheet pre").text(code); // 表示用
		new Function(code)(); // 実行用

	}

	//------------------------------------------------------------------------------------
	// ローディングインジケータ
	//------------------------------------------------------------------------------------
	{
		const code = `
$("#__nuLoading button").click(function() {
	nu.loading.show("読み込み中...");

	// 3秒後に非表示
	setTimeout(() => {
		nu.loading.hide();
	}, 3000);
});
            `.trim();

		$("#__nuLoading pre").text(code); // 表示用
		new Function(code)(); // 実行用
	}


	//------------------------------------------------------------------------------------
	// トースト通知　その1
	//------------------------------------------------------------------------------------
	{
		const code = `
$("#__nuToast button").click(function() {
	nu.toast("保存が完了しました！");
});
            `.trim();

		$("#__nuToast pre").text(code); // 表示用
		new Function(code)(); // 実行用
	}

	//------------------------------------------------------------------------------------
	// トースト通知　その2
	//------------------------------------------------------------------------------------
	{
		const code = `
$("#__nuToastDelay button").click(function() {
	const longMessage = "エラーが発生しましたエラーが発生しましたエラーが発生しましたエラーが発生しましたエラーが発生しましたエラーが発生しましたエラーが発生しましたエラーが発生しました";

	nu.toast(longMessage,
	{
		duration: 5000, // 5秒間表示
		type: "error",
		position: "top"
	});
});
            `.trim();

		$("#__nuToastDelay pre").text(code); // 表示用
		new Function(code)(); // 実行用
	}


	//------------------------------------------------------------------------------------
	// ドロップダウンメニュー　その１
	//------------------------------------------------------------------------------------
	{
		// TODO $("#__nuMenuTrigger button").click の形でメニューを表示できるようにしたい
		const code = `
nu.menu("__nuMenuTriggerBtn", {
		success: "成功",
		error: "エラー",
		warning: "警告",
		info: "インフォ",
	}, {
	onSuccess: function () {
		nu.toast.s("Clicked 成功");
	},
	onError: function () {
		nu.toast.e("Clicked エラー");
	},
	onWarning: function () {
		nu.toast.w("Clicked 警告");
	},
	onInfo: function () {
		nu.toast.i("Clicked インフォ");
	}
});
            `.trim();

		$("#__nuMenuTrigger pre").text(code); // 表示用
		new Function(code)(); // 実行用
	}

	//------------------------------------------------------------------------------------
	// ドロップダウンメニュー　その2 --ハンバーガータイプ
	//------------------------------------------------------------------------------------
	{
		const code = `
nu.menu("__nuMenuTriggerRBtn", {
		hoge: "ほげ",
		fuga: "ふが",
		pico: "ぴこ"
	}, {
	onHoge: function () {
		nu.toast("clicked ほげ");
	},
	onFuga: function () {
		nu.toast("clicked ふが");
	},
	onPico: function () {
		nu.toast("clicked ぴこ");
	}
});
            `.trim();

		$("#__nuMenuTriggerR pre").text(code); // 表示用
		new Function(code)(); // 実行用
	}


	//------------------------------------------------------------------------------------
	// 画像アップロードUI
	//------------------------------------------------------------------------------------
	{
		const code = `
nu.upload("uploadArea", {
	maxSize: 1024 * 1024, // 1MBまで
	url: "/api/upload/image"
}, {
	onError: function (msg) {
		nu.toast.e("エラー: " + msg);
	},
	onSuccess: function(msg) {
		nu.toast.s("登録完了: "+ msg);
	}
});
`.trim();

		$("#__nuUpload pre").text(code); // 表示用
		new Function(code)(); // 実行用
	}

	//------------------------------------------------------------------------------------
	// セグメントボタン　その１
	//------------------------------------------------------------------------------------
	{
		const code = `
nu.segment("__nuSegmentSortBtns", {
	name: "sampleSortOption",
	value: "最新",
	options: [
		{ label: "最新", value: "最新" },
		{ label: "人気", value: "人気" },
		{ label: "古い順", value: "古い順" }
	]
}, {
	onChange: (val) => nu.toast(val)
});
            `.trim();


		$("#__nuSegmentSort pre").text(code); // 表示用
		new Function(code)(); // 実行用
	}


	//------------------------------------------------------------------------------------
	// セグメントボタン　その２
	//------------------------------------------------------------------------------------
	{
		const code = `
nu.segment("__nuSegmentFruitsBtns", {
	name: "sampleFruitsOption",
	value: "メロン",
	options: [
		{ label: "りんご", value: "りんご" },
		{ label: "バナナ", value: "バナナ" },
		{ label: "メロン", value: "メロン" }
	]
}, {
	onChange: (val) => nu.toast(val)
});
            `.trim();

		$("#__nuSegmentFruits pre").text(code); // 表示用
		new Function(code)(); // 実行用
	}



	//------------------------------------------------------------------------------------
	// 検索ボックス
	//------------------------------------------------------------------------------------
	{
		const code = `
nu.search("__nuSearchBox", "/sample/site_search_index.json", {
	onConfirm: function (text) {
		nu.toast("🔍検索確定: " + text, {position: "top"});
	},
	onBlur: function (text) {
		nu.toast("🔎フォーカスアウト: " + text, {position: "top"});
	}
});
`.trim();
		$("#__nuSearch pre").text(code); // 表示用
		new Function(code)(); // 実行用
	}


	//------------------------------------------------------------------------------------
	// 入力欄に対して文字数カウンターを追加する　フィールド
	//------------------------------------------------------------------------------------
	{
		const code = `nu.count("__nuCountInputTarget", 30);`;
		$("#__nuCountInput pre").text(code); // 表示用
		new Function(code)(); // 実行用
	}

	//------------------------------------------------------------------------------------
	// 入力欄に対して文字数カウンターを追加する　テキストエリア
	//------------------------------------------------------------------------------------
	{
		const code = `nu.count("__nuCountTextareaTarget", 140);`;
		$("#__nuCountTextarea pre").text(code); // 表示用
		new Function(code)(); // 実行用
	}



	//------------------------------------------------------------------------------------
	// Submit
	//------------------------------------------------------------------------------------
	{
		const code = `
$("#__nuVals button").click(function() {
	const res = nu.vals("__nuForm");
	const jstr = JSON.stringify(res, null , 2);
	$("#nuSubmitRestArea").text(jstr);
	nu.d.table("nu.formData", res);
});
            `.trim();

		$("#__nuVals pre").text(code); // 表示用
		new Function(code)(); // 実行用

	}


	//------------------------------------------------------------------------------------
	// 表示用補助ツール　HTMLコードをエスケープさせる
	//------------------------------------------------------------------------------------
	function escapeHtml(str) {
		return str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
	document.querySelectorAll('pre.nuCodeBlock[data-html-safe]').forEach(pre => {
		const raw = pre.innerHTML.trim();
		pre.innerHTML = escapeHtml(raw);
	});

});