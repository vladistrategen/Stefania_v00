import ExtremeCalendar from './devextremeComponents/ExtremeScheduler';
import './App.css';
import React,{ useEffect } from 'react';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Calendar programari
        </p>
      <ExtremeCalendar/>
      </header>
    </div>
  );
}

export default App;
