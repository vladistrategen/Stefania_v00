import 'devextreme/dist/css/dx.light.css';
import '../App.css';
import axios from 'axios';
import React, { useEffect,useState } from 'react';
import Scheduler, { Editing, Resource } from 'devextreme-react/scheduler';
//import * as AspNetData from 'devextreme-aspnet-data-nojquery';
//import { patientsMockData,doctorsMockData,appointmentsMockData }  from './data';
import AppointmentCustom from './devextAppointment';
import AppointmentTooltipCustom from './devextAppointmentTooltip'; 
import {parseDataMultiple, parseDataSingle} from '../tools/FetchTools';
import CustomStore from 'devextreme/data/custom_store';
import { SelectBox } from 'devextreme-react/select-box';
import formtest from './Formtest'
import 'whatwg-fetch';
//import renderer from 'devextreme/core/renderer';
 

const base_url = '/api/appointments';


function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== "";
}

const dataSourcec = new CustomStore({
    key:'id',
    load:(loadOptions) => {
        console.log(loadOptions)
        let params="";
        if(loadOptions.searchValue!=null){
            params+='/'+loadOptions.searchValue.id;
        }
        //params=params.substring(0,params.length-1);
        return fetch(base_url+params)
        .then(response=>response.json())
        .then((data) => {
            console.log(data)
            return {
                data: parseDataSingle(data),
                totalCount: data.length};
            }).then().catch(error=>{
                console.log(error);
            }
        );

    },
    insert:(options) => {
        const insertUrl = base_url;
        console.log(insertUrl);
        return fetch(insertUrl, {
            method: 'POST',
            body: JSON.stringify(options.data)
        })
            .then(handleErrors)
            .then(response => response.json())
    },
    update:(options) => {
        const opstring = options.toString();
        const updateUrl=base_url+'/'+opstring;
        
        return fetch(updateUrl, {
            method: 'PUT',
            body: JSON.stringify(options.data)
        })
            .then(handleErrors)
            .then(response => response.json())
    },
    remove:(key) => {
        const removeUrl=base_url+`/${encodeURIComponent(key)}`;
        console.log(key);
        return fetch(removeUrl, {
            method: 'DELETE'
        })
            .then(handleErrors)
            .then(response => response.json())
    }
}),
    handleErrors = (response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }








function ExtremeCalendar() {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    
    

    const getAppointments = async () => {
        const res = await fetch('/api/appointments/');
        const data = await res.json();
        const parsedData = parseDataMultiple(data);
        console.log('data:',data)
        console.log('parsedData:',parsedData)
        setAppointments(parsedData);
        

    }
    const getDoctors = async () => {
        const res = await fetch('/api/doctors/');
        const data = await res.json();
        //console.log(data);

        setDoctors(data);
    }
    const getPatients = async () => {
        const res = await fetch('/api/patients/');
        const data = await res.json();
        //console.log(data);
        setPatients(data);
    }
    useEffect(() => {
        getAppointments();
        getDoctors();
        getPatients();
        //console.log(doctors);
        
    }, []);
    //return the scheduler with the AppointmentForm component
    
    //console.log('Appointments:',appointments);
    //console.log(doctors);
    //console.log(patients);


    

    const onAppointmentFormOpeningc = (e) => {
        //console.log(e);
        
        const {form} =e;
        //console.log(typeof form)
        // make handler function for form submit
        const onFormSubmit = () => {
            console.log('mergecuaie')
        }
        
        // give the form submit handler to the form
        //form.option('onFormSubmit', onFormSubmit);
    
        console.log(form.option())
        form.option('onEditorEnterKey', onFormSubmit);
        form.option('items', [{
            label: {text: 'Doctor'},
            editorType: 'dxSelectBox',
            dataField: 'doctorId',
            
            editorOptions: {
                
                dataSource: doctors,
                displayExpr: (item) => {return 'Dr. '+ item.first_name + ' ' + item.last_name},
                valueExpr: 'id',
                searchEnabled: true,
                // TODO: make data update when doctor is changed

            }
        }, {
            label: {text: 'Patient'},
            editorType: 'dxSelectBox',
            dataField: 'patientId',
            // make select boxes for doctors and patients larger
            
            editorOptions: {
                //width: 300,
                searchEnabled: true,
                dataSource: patients,
                displayExpr: (item) => {return item.middle_name==null? item.last_name + ' ' + item.first_name + ' - ' + item.birth_date :
                                        item.last_name + ' ' + item.first_name + ' ' + item.middle_name + ' - ' + item.birth_date},
                valueExpr: 'id'
            }
        }]);
        return 
    }

    const editingoptions = {
        allowAdding: true,
      allowDeleting: true,
      allowResizing: true,
      allowDragging: true,
      allowUpdating: true,
    };
    
    //console.log(doctors)
    //console.log(patients)
    
    
    return (
        
        <Scheduler
            
            dataSource={appointments}
            views={['day', 'week']}
            showAllDayPanel={false}
            editing={editingoptions}
            //startDayHour={8}
            //endDayHour={20}
            //cellDuration={15}
            defaultCurrentDate={new Date("2022-07-30")}
            appointmentComponent={AppointmentCustom}
            appointmentTooltipComponent={AppointmentTooltipCustom}
            onAppointmentFormOpening={formtest}
            onAppointment
            
        />
    )
}
         

export default ExtremeCalendar;