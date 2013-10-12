define(['underscore', 'd3'], function(_, d3) {
	var d3Proto = Object.create(HTMLTableElement.prototype);

	d3Proto.createdCallback = function() {
		this.createShadowRoot();
		this.charData = {};

		var columns = _.compact(_.pluck(this.getElementsByTagName('th'), 'innerText')),
			rows = _.pluck(this.getElementsByClassName('row-title'), 'innerText'),
			data,
			that = this;

		data = _.map(rows, function(row) {
			var p = _.filter(that.querySelectorAll('td[class="row-title"]'), function(td) {
					return td.innerText === row;
				})[0].parentNode,
				vals = _.pluck(p.querySelectorAll('td:not([class="row-title"])'), 'innerText'),
				cols = _.reduce(vals, function(m, v, i) {
					if (v === 'x') {
						m.push(columns[i]);
					}
					return m;
				}, []);

			return { row: row, columns: cols };
		});

		this.setChartData({
			rows: rows,
			columns: columns,
			data: data
		});
	};

	d3Proto.setChartData = function(chartData) {
		var marginTop = 120,
		marginLeft = 50,
		rowHeight = 30,
		columnWidth = 30,
		columnOffset = 140;

		var rowNodes = _.map(chartData.rows, function(row, i) {
			return {
				label: row,
				x: marginLeft,
				y: marginTop + i * rowHeight
			};
		});

		var columnNodes = _.map(chartData.columns, function(column, i) {
			return {
				label: column,
				x: marginLeft + columnOffset + (i * columnWidth),
				y: marginTop - 35
			};
		});

		var circleNodes = [];
		_.each(chartData.data, function(r) {
			var y = marginTop + chartData.rows.indexOf(r.row) * rowHeight - 8;
			_.each(r.columns, function(c) {
				var currentStacks = [],
				colName = typeof c === 'string' ? c : c.col;
				notes = c.notes;
				circleNodes.push({
					x: (marginLeft + columnOffset) + chartData.columns.indexOf(colName) * columnWidth,
					y: y,
					r: 10,
					notes: notes
				});
			});
		});

		createChart.call(this, rowNodes, columnNodes, circleNodes);
	};

	function createChart(rowNodes, columnNodes, circleNodes) {
		var svg = d3.select(this.shadowRoot).append('svg')
				.attr('width', 800)
				.attr('height', 350);

		svg.selectAll('.legend')
				.data(columnNodes)
			.enter().append('text')
				.attr('transform', function(d) {
					return 'translate(' + d.x + ', ' + d.y + ') rotate(-35)';
				})
				.text(function(d) { return d.label; });

		svg.selectAll('.columns')
				.data(rowNodes)
			.enter().append('text')
				.text(function(d) { return d.label; })
				.attr('x', function(d) { return d.x; })
				.attr('y', function(d) { return d.y; })
				.attr('class', 'column');

		svg.selectAll('circle')
				.data(circleNodes)
			.enter().append('circle')
				.attr('cx', function(d) { return d.x; })
				.attr('cy', function(d) { return d.y; })
				.attr('r', 0)
				.style('fill', function(d) { return 'darkred'; })
				.transition()
				.duration(500)
				.attr('r', function(d) { return d.r; })	

	}

	document.register('d3-component', { prototype: d3Proto });
});