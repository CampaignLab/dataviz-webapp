import React, {Component} from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';
import * as ss from 'simple-statistics';

const get_clean_data = (data, variable_x, variable_y) =>
  data.map((d) => [+d[variable_x], +d[variable_y]]);

const get_linear_regression = (data, variable_x, variable_y) =>
  ss.linearRegressionLine(
    ss.linearRegression(get_clean_data(data, variable_x, variable_y)),
  );

export default class Chart extends Component {
  render() {
    const {data, x, y, title} = this.props;

    let minmax = [
      d3.min(get_clean_data(data, x, y).map((d) => d[0])),
      d3.max(get_clean_data(data, x, y).map((d) => d[0])),
    ];

    const plotData = [
      {
        x: data.map((d) => +d[x]),
        y: data.map((d) => +d[y]),
        mode: 'markers',
        type: 'scatter',
      },
      {
        x: minmax,
        y: minmax.map((d) => get_linear_regression(data, x, y)(d)),
        mode: 'lines',
        type: 'scatter',
      },
    ];

    return (
      <Plot
        data={plotData}
        layout={{width: 1000, height: 1000, title: title}}
      />
    );
  }
}
