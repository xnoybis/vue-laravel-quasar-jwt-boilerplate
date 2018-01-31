// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
require(`./themes/app.${__THEME}.styl`);
// 2. or, use next line to activate DEFAULT QUASAR STYLE
// require(`quasar/dist/quasar.${__THEME}.css`);
// ==============================

import Vue from 'vue';
import Quasar, { Cookies } from 'quasar';
import router from './router';
import auth from './services/Auth';
import VueResource from 'vue-resource';
import jwtDecode from 'jwt-decode';

Vue.use(Quasar);
Vue.use(VueResource);

Vue.http.interceptors.push(function (request, next) {

	if (auth.getAuthHeader()) request.headers.set('Authorization', auth.getAuthHeader());

	next(function (response) {

		if (response.body.error) {
			if (response.body.error === 'token_expired') {

				return auth.refresh(this).then((result) => {
					let method = request.method.toLowerCase();
					return Vue.http[method](request.url, request.params);
				}).catch(() => {
					auth.logout();
				});

			}
			if (response.body.error === 'token_invalid' || response.body.error === 'token_not_provided') {
				auth.logout();
			}
		}

		if (response.headers.get('Authorization')) {
			let token = response.headers.get('Authorization').substr(7);

			if (token) {

				let expiry = jwtDecode(token).exp;
				let date = new Date((expiry * 1000) + (15 * 60 * 1000));
				Cookies.set('jwt', token, { expires: date });

			}
		}

	});

});

Quasar.start(() => {
	/* eslint-disable no-new */
	new Vue({
		el: '#q-app',
		router,
		render: h => h(require('./components/General/App'))
	});
});
