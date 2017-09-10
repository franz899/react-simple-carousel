import React, { Component } from 'react';

import './reset.css';
import './App.css';

import SimpleCarousel from "./SimpleCarousel";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Simple Carousel</h2>
        </div>
        <SimpleCarousel />
      </div>
    );
  }
}

export default App;
