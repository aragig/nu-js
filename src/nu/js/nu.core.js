;(function (global) {
	"use strict";

	const nu = global.nu = global.nu || {};



	//------------------------------------------------------------------------------------
	// ログユーティリティ
	//------------------------------------------------------------------------------------
	{
		if(!nu.d) nu.d = {};

		nu.d.begin = function (logTitle) {
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

		nu.d.log = function (...args) {
			console.log(...args);
		};

		nu.d.warn = function (...args) {
			console.warn(...args);
		};

		nu.d.error = function (...args) {
			console.error(...args);
		};

		nu.d.info = function (...args) {
			console.info(...args);
		};

		nu.d.json = function (label, obj) {
			console.groupCollapsed(`%c${label}`, "color: blue; font-weight: bold;");
			console.dir(obj);
			console.groupEnd();
		};

		nu.d.table = function (label, obj) {
			console.groupCollapsed(`%c${label}`, "color: green; font-weight: bold;");
			console.table(obj);
			console.groupEnd();
		}

		nu.d.end = function () {
			console.groupEnd();
		};
	}

})(window);

// 以下定義は、単体テストで必要
if (typeof module !== "undefined") {
	module.exports = window.nu;
}
