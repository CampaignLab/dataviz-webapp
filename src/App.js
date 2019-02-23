import React, {Component} from 'react';
import './App.css';
import {csv} from 'd3-fetch';
import Select from 'react-select';

import Chart from './Chart';
import * as stats from './stats';

const dataFile = 'health_data_merged_with_election_results.csv';

const toSelectOptions = (dataPointNames) => dataPointNames.map(toSelectOption);

const toSelectOption = (v) => {
  if (v) {
    return {value: v, label: v};
  } else {
    return undefined;
  }
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

    const {data, x} = this.state;
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

    const chartsToShow = 5;

    const rsquaredValues = possibleXs
      .map((d) => ({
        variable: d,
        rsquared: stats.getRsquared(data, d, y),
      }))
      .sort((a, b) => b.rsquared - a.rsquared)
      .slice(0, chartsToShow);

    const xSelectOptions = toSelectOptions(possibleXs);
    const ySelectOptions = toSelectOptions(possibleYs);

    let charts;
    if (x) {
      charts = (
        <Chart
          data={data}
          x={x}
          y={y}
          key={x}
          title={`${x} (R²: ${stats.getRsquared(data, x, y).toFixed(3)})`}
        />
      );
    } else {
      charts = rsquaredValues.map(({variable, rsquared}) => (
        <Chart
          data={data}
          x={variable}
          y={y}
          key={variable}
          title={`${variable} (R²: ${rsquared.toFixed(3)})`}
        />
      ));
    }

    return (
      <div className="app">
        <h1>Campaign Lab data</h1>
        <div className="toolbar">
          <div>
            <label>
              Y-axis
              <Select
                options={ySelectOptions}
                onChange={this.handleChangeY.bind(this)}
                value={toSelectOption(y)}
              />
            </label>
          </div>
          <div>
            <p>
              {x ? (
                ''
              ) : (
                <span>
                  Showing top {chartsToShow} 'most strongly correlated' (using
                  R²) data points with <code>{y}</code> &mdash; or search for
                  data point to show:
                </span>
              )}
            </p>
            <label>
              X-axis
              <Select
                options={xSelectOptions}
                onChange={this.handleChangeX.bind(this)}
                value={toSelectOption(x)}
                isClearable={true}
              />
            </label>
          </div>
        </div>
        {charts}
      </div>
    );
  }

  handleChangeY(yOption) {
    this.setState({y: yOption.value});
  }

  handleChangeX(xOption) {
    this.setState({x: xOption ? xOption.value : null});
  }
}

export default App;
