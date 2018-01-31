import { Toast } from 'quasar';

export default {

	showToast (msg, type, timeout = 4000) {

		let toastConfig = {};

		switch (type) {
		case 'negative':
			toastConfig = {
				html: msg,
				timeout: timeout,
				bgColor: '#f44336',
				color: '#fff',
				icon: 'error_outline'
			};
			break;
		case 'info':
			toastConfig = {
				html: msg,
				timeout: timeout,
				bgColor: '#2196f3',
				icon: 'info_outline'
			};
			break;
		case 'email':
			toastConfig = {
				html: msg,
				timeout: timeout,
				bgColor: '#2196f3',
				icon: 'email'
			};
			break;
		}

		Toast.create(toastConfig);

	}
};
