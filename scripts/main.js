require.config({
	paths: {
		d3: 'd3.v3.min'
	},
	shim: {
		d3: {
			exports: 'd3'
		},
		underscore: {
			exports: '_'
		}
	}
});

require(['d3_component'], function(d3Component) {
});