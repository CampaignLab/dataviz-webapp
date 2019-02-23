import React, {Component} from 'react';
import './App.css';
import Plot from 'react-plotly.js';
import {csv} from 'd3-fetch';
// import data from 'data//health_data_merged_with_election_results.csv';

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
    console.log(this.state);

    return (
      <div className="app">
        <Plot
          data={[
            {
              x: [1, 2, 3],
              y: [2, 6, 3],
              type: 'scatter',
              mode: 'lines+markers',
              marker: {color: 'red'},
            },
            {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
          ]}
          layout={{width: 320, height: 240, title: 'A Fancy Plot'}}
        />
      </div>
    );
  }
}

export default App;
