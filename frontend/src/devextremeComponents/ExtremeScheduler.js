import 'devextreme/dist/css/dx.light.css';
import '../App.css';
import React, { useEffect,useState,useMemo, useReducer } from 'react';
import Scheduler, { Editing, Resource } from 'devextreme-react/scheduler';

import AppointmentCustom from './devextAppointment';
import AppointmentTooltipCustom from './devextAppointmentTooltip'; 
import {parseDataMultiple, parseDataSingle,parseForRequest} from '../tools/FetchTools';
import { SelectBox } from 'devextreme-react/select-box';
import Popup, {ToolbarItem}from 'devextreme-react/popup';
import ScrollView from 'devextreme-react/scroll-view';
import DateBox from 'devextreme-react/date-box';


import notify from 'devextreme/ui/notify';
//import renderer from 'devextreme/core/renderer';
 

const base_url = '/api/appointments';




function ExtremeCalendar() {

    const initialFormState = {
        popupVisible: false,
        popupTitle: "customer",
        editData: {},
    };

    

    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [formState, dispatch] = useReducer(reducer, initialFormState);
    const [tempdata, setTempdata] = useState({});    
    const initialConfirmPopupState={
        popupVisible: false,
    }
    const [confirmPopupState, setConfirmPopupState] = useState(initialConfirmPopupState);
    const [csrftoken, setCsrfToken] = useState('');

    const getCsrfToken = async () => {
        // get the token from the cookie list
        const token = document.cookie.split(';').find(c => c.trim().startsWith('csrftoken='));
        if (token) {
            setCsrfToken(token.split('=')[1]);
        }
        console.log('token', token);
    }


    const getAppointments = async () => {
        const res = await fetch('/api/appointments/');
        const data = await res.json();
        const parsedData = parseDataMultiple(data);
        //console.log('data:',data)
        //console.log('parsedData:',parsedData)
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
        getCsrfToken();
        getAppointments();
        getDoctors();
        getPatients();
        //console.log(doctors);
        
    }, []);
    
    const buttonConfigSave = useMemo(() => {
        return {
            text: "Save",
            
            onClick: () => {
                if(formState.editData.id  ){
                    // make a put request
                    const requestOptions = {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
                        body: JSON.stringify(parseForRequest(formState.editData))
                    };
                    fetch(base_url + '/' + formState.editData.id + '/', requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            getAppointments();
                            dispatch({ popupVisible: false});
                            notify('Programare modificata', 'success', 3000);
                        });
                }else{
                    //TODO: make a post request
                }
                
            }
        };
    } , [setTempdata,dispatch,formState]);

    const buttonConfigDeleteCancel = useMemo(() => {
        return {
            text: "Cancel",
            type: "default",
            onClick: () => {
                dispatch({ popupVisible: false })
                .then(setConfirmPopupState({ popupVisible: false }));
            }
        };
    } ,[confirmPopupState]);

    const buttonConfigDelete = useMemo(() => {
        console.log(formState)
        return {
            text: "Sterge",
            type: "danger",
            useSubmitBehavior: true,
            onClick: () => {
                setConfirmPopupState({
                    popupVisible: true,
                    popupTitle: "Stergere",
                })
                dispatch({ popupVisible: false});
            }
        };
    } , [confirmPopupState,formState]);

    const buttonConfigDeleteConfirm = useMemo(() => {
        
        
        return {

            text: "Sterge",
            type: "danger",
            
            useSubmitBehavior: true,
            onClick: () => {
                setConfirmPopupState({popupVisible: false} )
                dispatch({ popupVisible: false })
                console.log('sters')
            }
        };
    } , [confirmPopupState,formState]);
    

    function reducer(state, action) {
        return { ...state, ...action };
    }
    
    
    const doctorDisplayExpr = (item) => {
        if(item!=null){
            return "Dr. " + item.last_name + " " + item.first_name;
        }
    }

    const patientDisplayExpr = (item) => {
        if(item != null){
            return item.middle_name === null ? item.last_name + " " + item.first_name + " " +item.birth_date
            : item.last_name + " " + item.middle_name + " " + item.first_name+ " " + item.birth_date;
        }
    }

    function CustomAppointmentFormRender()  {

        
        const onDoctorChange = (e) => {
            dispatch({editData: {...formState.editData, doctorId: e.value}});
        }
    
        const onPatientChange = (e) =>{
            dispatch({editData: {...formState.editData, patientId: e.value}});
        }
    
        const onStartDateChange = (e) =>{
            dispatch({editData: {editData: {...formState.editData,startDate: e.value}}});
        }
        
        const getDoctor = (id) => {
            return doctors.find(doctor => doctor.id === id);
        }
        const getPatient = (id) => {
            return patients.find(patient => patient.id === id);
        }
        return (
            <div>
                <ScrollView width="100%" height="100%">
                    {/* will only be displayed if appointment exists*/ }
                    
                        <div className='text-group'>
                            <p>Programare la: {doctorDisplayExpr(getDoctor(formState.editData.doctorId))}</p>
                            <p>Pacient: {patientDisplayExpr(getPatient(formState.editData.patientId))}</p>
                            <p>Data: {new Date(formState.editData.startDate).toLocaleDateString('en-RO')}</p>
                            <p>La ora: {new Date(formState.editData.startDate).toLocaleTimeString('en-RO')}</p>
                        </div>
                    <div>
                        <div className="dx-field-label">
                        </div>
                        <div>
                            <SelectBox
                                className="dx-field-label"
                                dataSource={doctors}
                                width={400}
                                searchEnabled={true}
                                placeholder="Doctor:"
                                onValueChanged={onDoctorChange}
                                displayExpr={doctorDisplayExpr}
                                value={formState.editData.doctorId}
                                valueExpr='id'
                            ></SelectBox>
                            {/* style this box so that it is 10 px lower than the previous one*/}
                            <SelectBox
                                style={{ marginTop: '10px' }}
                                className="dx-field-label"
                                dataSource={patients}
                                width={400}
                                placeholder="Pacient:"
                                onValueChanged={onPatientChange}
                                searchEnabled={true}
                                displayExpr={patientDisplayExpr}
                                value={formState.editData.patientId}
                                valueExpr='id'
                            ></SelectBox>
                        </div>
                        {/* style this date box so that it is 10 px lower than the previous one and has a label on its left saying  "Data si ora"*/}
                         
                            <DateBox
                                style={{ marginTop: '10px' }}
                                className="dx-field-label"
                                placeholder="Data:"
                                width={400}
                                type="datetime"
                                onValueChanged={onStartDateChange}
                                value={formState.editData.startDate}
                            ></DateBox>

                        
                    </div>

                </ScrollView>

            </div>
        );
    }

    
    
    function ConfirmDeletePopup(){
        return (
            <ScrollView width="100%" height="100%">
                <div className='text-group'>
                    {/* make an h1 tag styled centered both horizontally and vertically asking if they are sure they want to delete the appointment*/}
                    <h1 style={{textAlign: 'center', verticalAlign: 'middle'}}>Sunteti sigur ca doriti sa stergeti programarea?</h1>

                </div>
                
            </ScrollView>
        );
    }

    function onAppointmentFormOpeningc(e) {
        e.cancel = true;
        if(e.appointmentData.hasOwnProperty('id')){
            dispatch({popupVisible: true, editData:e.appointmentData, isEdit: true});
        }
        else{
            dispatch({popupVisible: true, editData:{}, isEdit: false});
        }

    }
    

    /*const AddPatientButton = () => {
        return (
            <Button
                text="Adauga pacient"
                type="default"

                onClick={() => {
                }}
            />
        );
    }*/

    const editingoptions = {
        allowAdding: true,
      allowDeleting: true,
      allowResizing: true,
      allowDragging: true,
      allowUpdating: true,
    };
    
    //console.log(doctors)
    //console.log(patients)
    function onHiding(e) {
        dispatch( {popupVisible: false });
        //console.log(formState);
    }
    
    

    return (
        <div>
            <Scheduler
                
                dataSource={appointments}
                views={['day', 'week']}
                showAllDayPanel={false}
                editing={editingoptions}
                defaultCurrentDate={new Date("2022-07-30")}
                appointmentComponent={AppointmentCustom}
                appointmentTooltipComponent={AppointmentTooltipCustom}
                onAppointmentFormOpening={onAppointmentFormOpeningc}
                
            />
            <Popup
                visible={formState.popupVisible}
                width={500}
                closeOnOutsideClick={true}
                onHiding={onHiding}
                title={formState.popupTitle}
                contentRender={CustomAppointmentFormRender} >
                    <ToolbarItem 
                    widget="dxButton"
                    toolbar="bottom"
                    location={'after'}
                    options={buttonConfigSave} />
                    <ToolbarItem 

                    widget={'dxButton'}
                    toolbar={'bottom'}
                    location={'left'}
                    options={buttonConfigDelete} />

                    

            </Popup>
            <Popup
                visible={confirmPopupState.popupVisible}
                height={'30%'}
                width={'50%'}
                closeOnOutsideClick={false}
                onHiding={() => setConfirmPopupState({...initialConfirmPopupState})}
                title={'Stergere programarea'}
                
                contentRender={ConfirmDeletePopup} >
                    
                    <ToolbarItem
                        widget={'dxButton'}
                        toolbar={'bottom'}
                        location={'left'}
                        options={buttonConfigDeleteConfirm} />
                    
                    <ToolbarItem
                        
                        widget={'dxButton'}
                        toolbar={'bottom'}
                        location={'after'}
                        options={buttonConfigDeleteCancel} />

            </Popup>



                
                
                

            </div>

    )
}
         

export default ExtremeCalendar;