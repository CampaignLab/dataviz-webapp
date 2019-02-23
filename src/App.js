import React, {Component} from 'react';
import './App.css';
import Plot from 'react-plotly.js';
import {csv} from 'd3-fetch';
import * as d3 from 'd3';
import * as ss from 'simple-statistics';

const dataFile = 'health_data_merged_with_election_results.csv';

class App extends Component {
  componentWillMount() {
    csv(dataFile).then((data) =>
      this.setState({
        data,
      }),
    );
  }

  render() {
    if (!this.state) {
      return <div />;
    }

    const get_clean_data = (data, variable_x, variable_y) =>
      data.map((d) => [+d[variable_x], +d[variable_y]]);

    const get_linear_regression = (data, variable_x, variable_y) =>
      ss.linearRegressionLine(
        ss.linearRegression(get_clean_data(data, variable_x, variable_y)),
      );

    const get_rsquared = (data, variable_x, variable_y) => {
      let data_to_fit = get_clean_data(data, variable_x, variable_y);
      let model = get_linear_regression(data, variable_x, variable_y);
      return ss.rSquared(data_to_fit, model);
    };

    const {data} = this.state;

    const possibleXs = Object.keys(data[0]).filter(
      (d) => ['Area Code', 'Area Name', 'Parent Name'].indexOf(d) == -1,
    );
    console.log('possibleXs [hxjklbcu]:', possibleXs); // eslint-disable-line no-console

    const x = possibleXs[0];
    const y = 'delta_Lab';

    let minmax = [
      d3.min(get_clean_data(data, x, y).map((d) => d[0])),
      d3.max(get_clean_data(data, x, y).map((d) => d[0])),
    ];

    return (
      <div className="app">
        <Plot
          data={[
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
          ]}
          layout={{width: 1000, height: 1000, title: 'A Fancy Plot'}}
        />
      </div>
    );
  }
}

export default App;
