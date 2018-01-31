import router from '../router';
import toasts from './ToastService';
import config from '../config';
import { Cookies } from 'quasar';
import jwtDecode from 'jwt-decode';

export default {

	// Send a request to the login URL
	login (context, credentials, redirect) {

		context.loading = true;

		context.error_email = false;
		context.error_password = false;

		context.$http.post(config.LOGIN_URL, credentials).then(response => {

			// successful login

			context.loading = false;

			if (response.body.token) {
				let token = response.body.token;
				let expiry = jwtDecode(token).exp + 300;
				let date = new Date(expiry * 1000);
				Cookies.set('jwt', token, { expires: date });

				if (redirect) {
					setTimeout(function () { router.push(redirect); }, 500);
				}
			}

		}, response => {

			// errors returned

			context.loading = false;

			let errors = 0;
			let errorMessages = '';

			if (response.body.error !== undefined) {
				// found error
				let errorObj = response.body.error;
				let statusCode = parseInt(errorObj.status_code, 10);
				let msg = errorObj.message;

				if (statusCode === 422) {
					if (errorObj.errors !== undefined) {
						// found multiple errors

						let emailError = errorObj.errors.email;
						if (emailError !== undefined) {
							// found e-mail error

							context.error_email = true;
							errorMessages += emailError[0] + '<br/>';
							errors++;
						}

						let passError = response.body.error.errors.password;
						if (passError !== undefined) {
							// found password error

							context.error_password = true;
							errorMessages += passError[0] + '<br/>';
							errors++;
						}
					}
				}

				if (statusCode === 401 || statusCode === 403 || statusCode === 500) {
					errors++;
					errorMessages += msg + '<br/>';
				}
			}

			if (errors > 0) {
				toasts.showToast(errorMessages, 'negative', 4000);
			}

		});

	},

	forgot (context, credentials) {

		context.loading = true;
		context.error_email = false;

		context.$http.post(config.FORGOT_URL, credentials).then(response => {

			// successful mail send

			context.loading = false;
			context.completed = true;

		}, response => {

			context.loading = false;
			context.completed = false;

			let errors = 0;
			let errorMessages = '';

			if (response.body.error !== undefined) {
				// found error
				let errorObj = response.body.error;
				let statusCode = parseInt(errorObj.status_code, 10);
				let msg = errorObj.message;

				if (statusCode === 422) {
					if (errorObj.errors !== undefined) {
						// found multiple errors

						let emailError = errorObj.errors.email;
						if (emailError !== undefined) {
							// found e-mail error

							context.error_email = true;
							errorMessages += emailError[0] + '<br/>';
							errors++;
						}

					}
				}

				if (statusCode === 403 || statusCode === 404 || statusCode === 500) {
					errors++;
					errorMessages += msg + '<br/>';
				}

			}

			if (errors > 0) {
				toasts.showToast(errorMessages, 'negative', 4000);
			}

		});

	},

	reset (context, data) {

		context.error_confirm = false;
		context.error_password = false;
		context.error_email = false;

		context.loading = true;

		context.$http.post(config.RESET_URL, data).then(response => {

			context.loading = false;
			context.completed = true;

		}, response => {

			context.loading = false;
			context.completed = false;

			let errors = 0;
			let errorMessages = '';

			if (response.body.error !== undefined) {
				// found error
				let errorObj = response.body.error;
				let statusCode = parseInt(errorObj.status_code, 10);
				let msg = errorObj.message;

				if (statusCode === 422) {
					if (errorObj.errors !== undefined) {
						// found multiple errors

						let emailError = errorObj.errors.email;
						if (emailError !== undefined) {
							// found e-mail error

							context.error_email = true;
							errorMessages += emailError[0] + '<br/>';
							errors++;
						}

						let passError = errorObj.errors.password;
						if (passError !== undefined) {
							// found password error

							context.error_password = true;
							context.error_confirm = true;
							errorMessages += passError[0] + '<br/>';
							errors++;
						}

					}
				}

				if (statusCode === 403 || statusCode === 404 || statusCode === 500) {
					errors++;
					errorMessages += msg + '<br/>';
				}
			}

			if (errors > 0) {
				toasts.showToast(errorMessages, 'negative', 4000);
			}

		});
	},

	getAuthHeader () {
		var jwt = Cookies.get('jwt');

		if (jwt) {
			return 'Bearer ' + Cookies.get('jwt');
		}

		return false;
	},

	checkAuth () {
		var jwt = Cookies.get('jwt');

		if (jwt) {
			return true;
		}

		return false;
	},

	checkAdmin () {

		var jwt = Cookies.get('jwt');

		if (jwt) {
			return parseInt(jwtDecode(jwt).admin, 10);
		}
		return false;

	},

	logout () {
		Cookies.remove('jwt');
		router.push('/account/login');
	},

	create (context, credentials) {

		context.loading = true;
		context.error_email = false;
		context.error_fullname = false;

		context.$http.post(config.CREATE_URL, credentials).then(response => {

			// successful account creation

			context.loading = false;
			context.error_email = false;
			context.error_name = false;
			context.getAccounts();
			context.email = '';
			context.name = '';
			toasts.showToast('Account has been created.', 'info', 4000);

		}, response => {

			context.loading = false;
			context.completed = false;
			context.error_email = false;
			context.error_name = false;

			let errors = 0;
			let errorMessages = '';

			if (response.body.error !== undefined) {
				// found error
				let errorObj = response.body.error;
				let statusCode = parseInt(errorObj.status_code, 10);
				let msg = errorObj.message;

				if (statusCode === 422) {
					if (errorObj.errors !== undefined) {
						// found multiple errors

						let emailError = errorObj.errors.email;
						if (emailError !== undefined) {
							// found e-mail error

							context.error_email = true;
							errorMessages += emailError[0] + '<br/>';
							errors++;
						}

						let nameError = errorObj.errors.name;
						if (nameError !== undefined) {

							context.error_name = true;
							errorMessages += nameError[0] + '<br/>';
							errors++;
						}

					}
				}

				if (statusCode === 403 || statusCode === 404 || statusCode === 500) {
					errors++;
					errorMessages += msg + '<br/>';
				}
			}

			if (errors > 0) {
				toasts.showToast(errorMessages, 'negative', 4000);
			}

		});
	},

	refresh (context) {

		return context.$http.post(config.REFRESH_URL).then(response => {
			return true;
		}, response => {
			return false;
		});

	}

};
