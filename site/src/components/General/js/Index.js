import { Events } from 'quasar';

export default {
	data () {
		return {

		};
	},
	mounted: function () {
		Events.$emit('SetTitle', 'Welcome');
	},
};
