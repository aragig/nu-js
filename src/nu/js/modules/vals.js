;(function (global) {
	"use strict";

	//------------------------------------------------------------------------------------
	// フォームの値を取得
	//------------------------------------------------------------------------------------

	const nu = global.nu = global.nu || {};


	/**
	 * フォームの値を取得し、コールバックに渡す
	 * @param {string} formId - 対象のform id名
	 * @returns {Object} formDataを渡す
	 */
	nu.vals = function (formId) {
		if (!formId) return;

		const el = document.getElementById(formId);
		if (!el) {
			console.warn(`formId "${formId}" の要素が見つかりません`);
			return;
		}

		return getFormValues(document.getElementById(formId));
	};

	//--- 以下は private メソッド
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



})(window);
