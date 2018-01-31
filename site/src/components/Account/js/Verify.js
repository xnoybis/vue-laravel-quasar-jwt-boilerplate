import auth from '../../../services/Auth';

export default {
	data: function () {
		return {
			details: {
				email: '',
				password: '',
				confirm: '',
				token: this.$route.params.token
			},
			error_email: false,
			error_confirm: false,
			error_password: false,
			loading: false,
			completed: false,
		};
	},
	methods: {
		submit () {

			auth.reset(this, {
				email: this.details.email,
				password: this.details.password,
				password_confirmation: this.details.confirm,
				token: this.details.token
			});

		},
	}
};
