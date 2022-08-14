import 'devextreme/dist/css/dx.light.css';
import '../App.css';
import axios from 'axios';
import React, { useEffect,useState } from 'react';
import Scheduler, { Editing, Resource } from 'devextreme-react/scheduler';
import {appointments,doctors} from './data.js';
import AppointmentCustom from './devextAppointment';
import AppointmentTooltipCustom from './devextAppointmentTooltip'; 
import parseData from '../components/Fetchtest';
import 'whatwg-fetch';
import renderer from 'devextreme/core/renderer';
 
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
 


function ExtremeCalendar() {
    const [appointments, setAppointments] = useState([]);
    useEffect(() => {
        getAppointments()
    }, []);

    let getAppointments = async () => {
        const res = await fetch('http://127.0.0.1:8000/api/appointments');
        const data = await res.json();
        
        const parsedData = parseData(data);
        console.log(parsedData);
        setAppointments(parsedData);

    }

    //return the scheduler with the AppointmentForm component
    
    const onAppointmentFormOpeningc = (e) => {
        const {form} =e;
        form.option('items', [{
            label: {text: 'Doctor'},
            editorType: 'dxSelectBox',
            dataField: 'doctorId',
            editorOptions: {
                dataSource: doctors,
                displayExpr: 'name',
                valueExpr: 'id'
            }
        }, {
            label: {text: 'Patient'},
            editorType: 'dxSelectBox',
            dataField: 'patientId',
            editorOptions: {
                dataSource: doctors,
                displayExpr: 'name',
                valueExpr: 'id'
            }
        }]);
    }

            
    

    return (
        
        <Scheduler
            dataSource={appointments}
            defaultCurrentDate="2022-07-30"
            appointmentComponent={AppointmentCustom}
            onAppointmentFormOpening={onAppointmentFormOpeningc}
        />
    )
}
         

export default ExtremeCalendar;