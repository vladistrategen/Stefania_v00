import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import ExtremeCalendar from './devextremeComponents/ExtremeScheduler';
import './App.css';
import Calendar from './components/Scheduler';
import Demo from './components/Demo';
import React,{ useEffect } from 'react';
import ExtremeCalendarClassComponent from './devextremeComponents/ExtremeSchedulerClass';
import { WeekView } from '@devexpress/dx-react-scheduler';
import Fetchtest from './tools/FetchTools';

function App() {

  

  return (
    <div className="App">
      <header className="App-header">
        
        <p>
          Edit <code>src/App.js</code> yodsdada
        </p>
        
        
        
      {/* create a button that sticks to the bottom right named add appointment*/}
      <ExtremeCalendar />
     
      
      </header>
    </div>
  );
}

export default App;
