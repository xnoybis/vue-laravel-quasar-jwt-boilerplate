import auth from '../../../services/Auth';

export default {
	data () {
		return {
			email: '',
			password: '',
			loading: false,
			error_email: false,
			error_password: false,
		};
	},
	methods: {
		submit () {
			auth.login(this, {
				email: this.email,
				password: this.password
			}, '/');
		}
	}
};
