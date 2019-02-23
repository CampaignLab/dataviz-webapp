import React, {Component} from 'react';
import './App.css';
import {csv} from 'd3-fetch';
import * as ss from 'simple-statistics';

import Chart from './Chart';

const dataFile = 'health_data_merged_with_election_results.csv';

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

    const {data} = this.state;

    const y = 'delta_Lab';

    const possibleXs = Object.keys(data[0]).filter(
      (d) =>
        [
          'Area Code',
          'Area Name',
          'Parent Name',
          '2018_pct_Con',
          '2018_pct_Lab',
          '2018_pct_LDem',
          '2018_pct_UKIP',
          '2018_pct_Grn',
          '2018_pct_Ind',
          '2018_pct_Oth',
          'delta_Con',
          'delta_Lab',
          'delta_LDem',
          'delta_UKIP',
          'delta_Grn',
          'delta_Ind',
          'delta_Oth',
          '2014_PCT_Con',
          '2014_PCT_Lab',
          '2014_PCT_LDem',
          '2014_PCT_UKIP',
          '2014_PCT_Grn',
          '2014_PCT_Ind',
        ].indexOf(d) === -1,
    );

    const rsquaredValues = possibleXs
      .map((d) => ({
        variable: d,
        rsquared: get_rsquared(data, d, y),
      }))
      .sort((a, b) => b.rsquared - a.rsquared)
      .slice(0, 5)
      .map((r) => r['variable']);

    return (
      <div className="app">
        {rsquaredValues.map((x) => (
          <Chart data={data} x={x} y={y} key={x} />
        ))}
      </div>
    );
  }
}

export default App;
