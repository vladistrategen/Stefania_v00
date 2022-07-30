
import './App.css';
import Calendar from './components/Scheduler';
import React,{ useEffect } from 'react';
function App() {

  useEffect(() => {
     fetch('/api/appointments')
        .then(res => res.json())
        .then(data => console.log(data));  
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        
        <p>
          Edit <code>src/App.js</code> yodsdada
        </p>
        
        {/* render the Calendar component */}
        <Calendar />

      </header>
    </div>
  );
}

export default App;
