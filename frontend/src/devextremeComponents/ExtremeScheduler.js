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
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    useEffect(() => {
        getAppointments()
        getDoctors()
        getPatients()
        console.log(doctors);
    }, []);

    let getAppointments = async () => {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        
        const parsedData = parseData(data);
        //console.log(parsedData);
        setAppointments(parsedData);

    }


    let getDoctors = async () => {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        setDoctors(data);
    }

    let getPatients = async () => {
        const res = await fetch('/api/patients');
        const data = await res.json();
        setPatients(data);
    }

    //return the scheduler with the AppointmentForm component
    
    const onAppointmentFormOpeningc = (e) => {
        const {form} =e;
        // make select boxes for doctors and patients larger
        form.option('items', [{
            label: {text: 'Doctor'},
            editorType: 'dxSelectBox',
            dataField: 'doctorId',
            editorOptions: {
                dataSource: doctors,
                displayExpr: (item) => {return 'Dr. '+ item.first_name + ' ' + item.last_name},
                valueExpr: 'id',

                // TODO: make data update when doctor is changed

            }
        }, {
            label: {text: 'Patient'},
            editorType: 'dxSelectBox',
            dataField: 'patientId',
            // make select boxes for doctors and patients larger
            
            editorOptions: {
                //width: 300,
                
                dataSource: patients,
                displayExpr: (item) => {return item.middle_name==null? item.last_name + ' ' + item.first_name + ' - ' + item.birth_date :
                                        item.last_name + ' ' + item.first_name + ' ' + item.middle_name + ' - ' + item.birth_date},
                valueExpr: 'id'
            }
        }]);
    }

            
    

    return (
        
        <Scheduler
            dataSource={appointments}
            views={['day', 'week']}
            showAllDayPanel={false}
            
            cellDuration={15}
            defaultCurrentDate="2022-07-27"
            appointmentComponent={AppointmentCustom}
            appointmentTooltipComponent={AppointmentTooltipCustom}
            onAppointmentFormOpening={onAppointmentFormOpeningc}
        />
    )
}
         

export default ExtremeCalendar;