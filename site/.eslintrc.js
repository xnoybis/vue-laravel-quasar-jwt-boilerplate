module.exports = {
	root: true,
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true
	},
	globals: {
		'cordova': true,
		'DEV': true,
		'PROD': true,
		'__THEME': true
	},
	// https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
	extends: 'standard',
	// required to lint *.vue files
	plugins: [
		'html'
	],
	// add your custom rules here
	'rules': {
		// allow paren-less arrow functions
		'arrow-parens': 0,
		'one-var': 0,
		'import/first': 0,
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		'brace-style': [2, '1tbs', { 'allowSingleLine': true }],
		'comma-dangle': [2, 'only-multiline'],
		'indent': [2, 'tab'],
		'no-tabs': 0,
		'padded-blocks': 0,
		'semi': [2, "always"]
	}
}
