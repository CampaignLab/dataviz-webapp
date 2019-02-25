import React, {Component} from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

import * as stats from './stats';

export default class Chart extends Component {
  render() {
    const {data, x, y} = this.props;

    let minmax = [
      d3.min(stats.getCleanData(data, x, y).map((d) => d[0])),
      d3.max(stats.getCleanData(data, x, y).map((d) => d[0])),
    ];

    const plotData = [
      {
        x: data.map((d) => +d[x]),
        y: data.map((d) => +d[y]),
        text: data.map((d) => d['Area Name']),
        mode: 'markers',
        type: 'scatter',
      },
      {
        x: minmax,
        y: minmax.map((d) => stats.getLinearRegression(data, x, y)(d)),
        mode: 'lines',
        type: 'scatter',
      },
    ];

    const rSquared = stats.getRsquared(data, x, y);

    return (
      <Plot
        data={plotData}
        layout={{
          width: 1000,
          height: 600,
          title: `${x} (R²: ${rSquared.toFixed(3)})`,
          yaxis: {title: y},
          hovermode: 'closest',
          showlegend: false,
        }}
        config={{
          displayModeBar: false,
        }}
      />
    );
  }
}
