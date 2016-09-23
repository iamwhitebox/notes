/*global app, Router */

(function (app, Router) {

	'use strict';

	var router = new Router();

	router.configure({
		notfound: function () {
			window.location.hash = '';
			app.visibility = 'all';
		}
	});

	router.init();

})(app, Router);
