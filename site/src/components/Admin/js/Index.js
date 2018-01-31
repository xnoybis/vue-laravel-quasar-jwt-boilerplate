import { Events } from 'quasar';
import auth from '../../../services/Auth';
import router from '../../../router';

export default {
	data () {
		return {

		};
	},
	mounted: function () {
		Events.$emit('SetTitle', 'Administration');

		if (!auth.checkAdmin()) router.push('/');

	},
};
