import auth from '../../../services/Auth';

export default {
	data () {
		return {
			email: '',
			fullname: '',
			password: '',
			password_confirm: '',
			error_email: false,
			error_fullname: false,
			error_password: false,
			error_confirm: false,
			loading: false,
		};
	},
	methods: {
		submit () {
			auth.register(this, {
				email: this.email,
				fullname: this.fullname,
				password: this.password,
				confirm: this.password_confirm,
			}, '/');
		}
	}
};
