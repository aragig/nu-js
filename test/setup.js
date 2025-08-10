// test/setup.js
const { JSDOM } = require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
	url: "http://localhost",
	pretendToBeVisual: true, // requestAnimationFrame 有効化
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.requestAnimationFrame = dom.window.requestAnimationFrame;
global.cancelAnimationFrame = dom.window.cancelAnimationFrame;

// どのテストでも expect が使えるように
global.expect = require("chai").expect;

// 依存関係の都合で、常に nu.js 経由で読み込む前提ならここで一度だけ require
global.nu = require("../src/nu/js/nu.js");

// fetch はテストごとに差し替えたいケースが多いので、デフォはダミーでOK
if (typeof global.fetch === "undefined") {
	global.fetch = () => Promise.resolve({ json: async () => ({}) });
}
