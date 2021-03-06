import React, {Component} from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

import * as stats from './stats';

export default class Chart extends Component {
  render() {
    const {x, y} = this.props;
    let {data} = this.props;

    // Filter out points where Y-axis value is 0, generally indicates area
    // where party didn't stand and so not useful to show.
    // XXX Do this in parent component before we sort stuff by R-squared so
    // charts not potentially out of order.
    data = data.filter((d) => +d[y] !== 0);

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
