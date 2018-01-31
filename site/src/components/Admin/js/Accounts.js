import auth from '../../../services/Auth';
import config from '../../../config';

export default {
	data () {
		return {
			loading: false,
			loaded: false,
			email: '',
			name: '',
			error_email: false,
			error_name: false,
			table: [],
			page: 1,
			config: {
				rowHeight: '50px',
				title: '',
				noHeader: false,
				refresh: false,
				columnPicker: false,
				leftStickyColumns: 0,
				rightStickyColumns: 0,
				bodyStyle: {
					maxHeight: '9999px'
				},
				responsive: false,
				pagination: {
					rowsPerPage: 10,
					options: [10, 20, 50, 100]
				},
				messages: {
					noData: '<i>warning</i> No data available to show.',
					noDataAfterFiltering: '<i>warning</i> No results. Please refine your search terms.'
				},
				labels: {
					allCols: 'Everything',
					rows: 'Rows per page',
					search: 'Filter',
					all: 'All'
				}
			},
			columns: [{
				label: 'Status',
				field: 'status',
				width: '100px',
				style: {},
				classes: '',
				filter: true,
				sort: true,
				format (value) {
					let labelClass = 'bg-warning';
					let labelText = 'Unverified';
					switch (value) {
					case 1:
						labelClass = 'bg-positive';
						labelText = 'Verified';
						break;
					case 2:
						labelClass = 'bg-negative';
						labelText = 'Suspended';
						break;
					}
					if (value >= 0) return '<span class="label text-white text-bold ' + labelClass + '">' + labelText + '</span>';
				}
			},
			{
				label: 'ID',
				field: 'id',
				width: '50px',
				style: {},
				classes: '',
				filter: true,
				sort: true,
			},
			{
				label: 'Name',
				field: 'name',
				width: '150px',
				style: {},
				classes: '',
				filter: true,
				sort: true,
			},
			{
				label: 'E-mail address',
				field: 'email',
				width: '150px',
				style: {},
				classes: '',
				filter: true,
				sort: true,
			},
			{
				label: 'Created',
				field: 'created_at',
				width: '130px',
				style: {},
				classes: '',
				filter: true,
				sort: true,
			},
			{
				label: 'Last Login',
				field: 'last_login',
				width: '130px',
				style: {},
				classes: '',
				filter: true,
				sort: true,
			},
			]
		};
	},
	mounted: function () {
		this.getAccounts();
	},
	methods: {
		getAccounts () {
			this.loaded = false;
			this.$http.get(config.ACCOUNTS_URL).then(response => {
				this.table = response.body;
				this.loaded = true;
			}, {
			});
		},
		submit () {
			auth.create(this, {
				name: this.name,
				email: this.email,
			});
		}
	}
};
