import ExtremeCalendar from './devextremeComponents/ExtremeScheduler';
import './App.css';
import React from 'react';
import { AppointmentCalendarProvider } from './devextremeComponents/AppointmentCalendarProvider';
import AppointmentCalendar from './devextremeComponents/AppointmentCalendar';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Calendar programari
        </p>
        <AppointmentCalendarProvider>
          <AppointmentCalendar />
        </AppointmentCalendarProvider>
      </header>
    </div>
  );
}

export default App;
