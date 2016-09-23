/*jshint unused:false */

(function (exports) {

	'use strict';

	var STORAGE_KEY = 'notes';

	exports.noteStorage = {
		fetch: function () {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		},
		save: function (notes) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
		}
	};

})(window);