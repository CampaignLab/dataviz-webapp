import React, {Component} from 'react';
import './App.css';
import {csv} from 'd3-fetch';

import Chart from './Chart';

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

    const possibleXs = Object.keys(data[0]).filter(
      (d) => ['Area Code', 'Area Name', 'Parent Name'].indexOf(d) === -1,
    );

    return (
      <div className="app">
        {possibleXs.map((x) => (
          <Chart data={data} x={x} key={x} />
        ))}
      </div>
    );
  }
}

export default App;
