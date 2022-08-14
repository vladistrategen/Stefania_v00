import { ViewState,EditingState,IntegratedEditing, } from '@devexpress/dx-react-scheduler';
import {AllDayPanel,Scheduler,AppointmentForm,AppointmentTooltip,Appointments,WeekView,DayView,GroupingPanel } from '@devexpress/dx-react-scheduler-material-ui';    
import React from 'react';





const Calendar=() => {
    return <div id="Scheduler">
        <Scheduler >
            <ViewState />
            <EditingState />
            <IntegratedEditing />
            <WeekView />
            <Appointments />
            <AppointmentTooltip />
            <AllDayPanel />
            <AppointmentForm />
            
        </Scheduler>
        
    </div>;
}


export default Calendar;