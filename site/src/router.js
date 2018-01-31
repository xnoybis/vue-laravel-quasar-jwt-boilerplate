import Vue from 'vue';
import VueRouter from 'vue-router';
import auth from './services/Auth';

Vue.use(VueRouter);

function load (component) {
	return () => System.import(`components/${component}.vue`);
}

function checkAuth (to, from, next) {

	if (!auth.checkAuth()) {
		auth.logout();
		next('/account/login');
	} else {
		next();
	}

}

function checkAdmin (to, from, next) {

	if (!auth.checkAuth()) {
		auth.logout();
		next('/account/login');
	} else {
		if (!auth.checkAdmin()) {
			next('/');
		} else {
			next();
		}
	}
}

export default new VueRouter({
	/*
	* NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
	* it is only to be used only for websites.
	*
	* If you decide to go with "history" mode, please also open /config/index.js
	* and set "build.publicPath" to something other than an empty string.
	* Example: '/' instead of current ''
	*
	* If switching back to default "hash" mode, don't forget to set the
	* build publicPath back to '' so Cordova builds work again.
	*/

	routes: [
		{
			path: '/',
			component: load('General/Index'),
			beforeEnter: checkAuth,
		},
		{
			path: '/admin',
			component: load('Admin/Index'),
			beforeEnter: checkAdmin,
			children: [
				{
					path: 'accounts',
					component: load('Admin/Accounts'),
					beforeEnter: checkAdmin,
				}
			]
		},
		// non-protected routes below
		{
			path: '/account/login',
			component: load('Account/Login')
		},
		{
			path: '/account/reset/:token',
			component: load('Account/Reset')
		},
		{
			path: '/account/setup/:token',
			component: load('Account/Verify')
		},
		{
			path: '/account/logout',
			beforeEnter: function (to, from, next) {
				auth.logout();
			},
		},
		{
			path: '/account/forgot',
			component: load('Account/Forgot')
		},
		{
			path: '*',
			component: load('General/Error404')
		}
	]
});
