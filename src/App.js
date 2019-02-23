import React, {Component} from 'react';
import './App.css';
import {csv} from 'd3-fetch';

import Chart from './Chart';
import * as stats from './stats';

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

    const {data} = this.state;
    let {y} = this.state;

    const possibleYs = [
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
    ];
    if (!y) {
      y = possibleYs[0];
    }

    const notShownXs = [...possibleYs, 'Area Code', 'Area Name', 'Parent Name'];
    const possibleXs = Object.keys(data[0]).filter(
      (d) => notShownXs.indexOf(d) === -1,
    );

    const rsquaredValues = possibleXs
      .map((d) => ({
        variable: d,
        rsquared: stats.getRsquared(data, d, y),
      }))
      .sort((a, b) => b.rsquared - a.rsquared)
      .slice(0, 5);

    return (
      <div className="app">
        <div className="y-select">
          <select onChange={this.onChangeY.bind(this)}>
            {possibleYs.map((x) => (
              <option value={x} key={x}>
                {x}
              </option>
            ))}
          </select>
        </div>
        <div className="charts">
          {rsquaredValues.map(({variable, rsquared}) => (
            <Chart
              data={data}
              x={variable}
              y={y}
              key={variable}
              title={`${variable} (R²: ${rsquared})`}
            />
          ))}
        </div>
      </div>
    );
  }

  onChangeY(event) {
    this.setState({y: event.target.value});
  }
}

export default App;
