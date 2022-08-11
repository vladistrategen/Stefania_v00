
import './App.css';
import Calendar from './components/Scheduler';
import Demo from './components/Demo';
import React,{ useEffect } from 'react';
import { WeekView } from '@devexpress/dx-react-scheduler';
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
        
        
        
      {/* create a button that sticks to the bottom right named add appointment*/}
      <Demo />
      
      </header>
    </div>
  );
}

export default App;
