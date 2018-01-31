import auth from '../../../services/Auth';

export default {
	data () {
		return {
			email: '',
			loading: false,
			error_email: false,
			completed: false
		};
	},
	methods: {
		submit () {
			auth.forgot(this, {
				email: this.email
			});
		}
	}
};
