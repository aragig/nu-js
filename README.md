# ぬ - nu.js

**nu.js** は、ライブラリに依存しない Vanilla JS で作られた UI 補助ツールです。  
軽量でありながら実用的なUI機能を提供し、**jQueryとの共存**も可能です。

👉 **サンプルページはこちら**  
https://apppppp.com/kit/nu-js/

---

## 特徴

- **依存なし**：フレームワークに依存せず、純粋なJavaScriptで動作
- **モダンなUI体験**：トースト通知、カスタムアラート、オーバーレイなどのUIを簡単に導入
- **jQueryと併用可**：既存のjQueryコードに影響を与えず、共存可能
- **SCSSによるスタイル設計**：モバイルUIを意識したレスポンシブるデザイン

---

## 導入方法

```html
<!-- CSS -->
<link rel="stylesheet" href="src/nu/css/utils.css">
<link rel="stylesheet" href="src/nu/css/neoux.css">

<!-- JavaScript -->
<script src="src/nu/js/nu.js"></script>
<!-- （必要に応じて jQuery も併用可能） -->
<script src="lib/js/jquery-3.7.1.js"></script>
```

## CDN経由での読み込み

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/aragig/nu-js@v2025.7.26.1/src/nu/css/utils.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/aragig/nu-js@v2025.7.26.1/src/nu/css/nu.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/aragig/nu-js@v2025.7.26.1/src/nu/js/nu.js"></script>
<!-- jQuery（公式CDN） -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
```