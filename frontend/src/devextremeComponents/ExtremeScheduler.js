import 'devextreme/dist/css/dx.light.css';
import '../App.css';
import React, { useEffect,useState,useMemo, useReducer } from 'react';
import Scheduler, { Editing, Resource } from 'devextreme-react/scheduler';

import AppointmentCustom from './devextAppointment';
import AppointmentTooltipCustom from './devextAppointmentTooltip'; 
import {parseDataMultiple, parseDataSingle,parseForRequest} from '../tools/FetchTools';
import { SelectBox} from 'devextreme-react/select-box';
import {NumberBox} from 'devextreme-react/number-box';
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
        editData: {
            "description": "",
            "startDate": new Date(),
            'endDate': new Date(),
            "doctorId": 0,
            "patientId": 0,
            "confirmation_status": "pending_not_sent",
            "completed": false,
            "price": 0,

        },
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
    const [createPopupState, setCreatePopupState] = useState(initialFormState);
    const [csrftoken, setCsrfToken] = useState('');

    const getCsrfToken = async () => {
        // get the token from the cookie list
        const token = document.cookie.split(';').find(c => c.trim().startsWith('csrftoken='));
        if (token) {
            setCsrfToken(token.split('=')[1]);
        }
        //console.log('token', token);
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
            text: "Salveaza",
            type: "success",
            useSubmitBehavior: true,
            
            onClick: async () => {
                if(formState.editData.id  ){
                    // make a put request
                    const requestOptions = {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
                        body: JSON.stringify(parseForRequest(formState.editData))
                    };
                    await fetch(base_url + '/' + formState.editData.id + '/', requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            
                            getAppointments();
                            dispatch({ popupVisible: false});
                            notify('Programare modificata', 'success', 3000);
                        });
                }else{
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
                        body: JSON.stringify(parseForRequest(createPopupState.editData))
                    };
                    await fetch(base_url + '/', requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            console.log("Post request data:",data)
                            getAppointments();
                        ;})
                        .then(setCreatePopupState({...createPopupState,popupVisible:false}))
                        .then(notify('Programare creata', 'success', 3000))
                        
                    }   
                
            }
        };
    } , [setTempdata,dispatch,formState,createPopupState]);

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
            onClick: async () => {
                // check for null case
                if (formState.editData.id) {

                    const requestOptions = {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken
                        },
                    };
                    await fetch(base_url + '/' + formState.editData.id + '/', requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            getAppointments();
                            setConfirmPopupState({ ...confirmPopupState, popupVisible: false });
                            notify('Programare stearsa', 'success', 3000);
                        })

                }
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
                    {/* will only be displayed if appointment exists*/}

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

    function CustomAppointmentCreateForm() {
        const onDoctorChange = (e) => {
            setCreatePopupState({...createPopupState,editData: {...createPopupState.editData, doctorId: e.value}})
            
        }
        const onPatientChange = (e) =>{
            setCreatePopupState({...createPopupState,editData: {...createPopupState.editData, patientId: e.value}});
        }
        const onStartDateChange = (e) =>{
            setCreatePopupState({...createPopupState,editData: {...createPopupState.editData,startDate: e.value}});
        }
        const onDurationChange = (e) =>{
            const newvalue = new Date(createPopupState.editData.startDate).getTime() + e.value * 60000;
            const newEndDate = new Date(newvalue);
            setCreatePopupState({...createPopupState,editData: {...createPopupState.editData,endDate: newEndDate}});
        }
        const getMinutes = (startDate,endDate) => {
            const d1 = new Date(startDate);
            const d2 = new Date(endDate);
            return parseInt((d2.getTime() - d1.getTime()) / 60000);
        }
        
        return (
            <div>
                <ScrollView width="100%" height="100%">
                    <div className='text-group'>
                        <h1>Creaza o noua programare</h1>
                    </div>
                    <div>
                        <div className='dx-field'>
                            <div className="dx-field-label" style={{ marginTop: '10px' }}> Doctor:</div>
                            <div>
                                <SelectBox
                                    style={{ marginTop: '10px' }}
                                    className="dx-field-value"
                                    dataSource={doctors}
                                    
                                    searchEnabled={true}
                                    placeholder="Doctor:"
                                    value={createPopupState.editData.doctorId}
                                    onValueChanged={onDoctorChange}
                                    displayExpr={doctorDisplayExpr}
                                    valueExpr='id'
                                ></SelectBox>
                            </div>
                        </div>
                        <div className='dx-field'>
                            <div className="dx-field-label" style={{ marginTop: '10px' }}> Pacient:</div>
                            <div >
                                <SelectBox
                                    style={{ marginTop: '10px' }}
                                    className="dx-field-value"
                                    dataSource={patients}

                                    searchEnabled={true}
                                    placeholder="Pacient:"
                                    onValueChanged={onPatientChange}
                                    value={createPopupState.editData.patientId}
                                    displayExpr={patientDisplayExpr}
                                    valueExpr='id'
                                ></SelectBox>
                            </div>
                        </div>
                        <div className='dx-field' >
                            <div className="dx-field-label" style={{ marginTop: '10px' }}> Data si ora:</div>
                            <div >
                                <DateBox
                                    style={{ marginTop: '10px' }}
                                    className="dx-field-value"
                                    placeholder="Data:"
                                    type="datetime"
                                    onValueChanged={onStartDateChange}
                                    value={createPopupState.editData.startDate}
                                ></DateBox>
                            </div>
                        </div>

                        <div className='dx-field' >
                            <div className='dx-field-label' style={{ marginTop: '10px' }}>
                                Durata:
                            </div>
                            <div className="dx-field-value">
                                <NumberBox
                                    style={{ marginTop: '10px' }}
                                    onValueChanged={onDurationChange}
                                    value={getMinutes(createPopupState.editData.startDate,createPopupState.editData.endDate)}
                                ></NumberBox>
                            </div>
                        </div>
                        
                    </div>
                </ScrollView>
            </div>
        );
    }
    
    
    
    function ConfirmDeletePopup(){
        return (
            <ScrollView width="100%" height="100%">
                <div className='text-group'>
                    <h1 style={{textAlign: 'center', verticalAlign: 'middle'}}>Sunteti sigur ca doriti sa stergeti programarea?</h1>

                </div>
                
            </ScrollView>
        );
    }

    function onAppointmentFormOpeningc(e) {
        
        e.cancel = true;
        if(e.appointmentData.hasOwnProperty('id')){
            dispatch({popupVisible: true, editData:e.appointmentData, popupTitle: 'Editare programare'});
        }
        else{
            setCreatePopupState({...confirmPopupState,popupVisible: true, editData:{...confirmPopupState.editData,startDate:e.appointmentData.startDate,
            endDate:e.appointmentData.endDate}, popupTitle: 'Creare programare'})
           
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
            <Popup // the popup for editing appointments
                visible={formState.popupVisible}
                width={500}
                closeOnOutsideClick={true}
                onHiding={onHiding}
                title={formState.popupTitle}
                contentRender={CustomAppointmentFormRender} >
                    <ToolbarItem // the toolbar item for the save button
                    widget="dxButton"
                    toolbar="bottom"
                    location={'after'}
                    options={buttonConfigSave} />
                    <ToolbarItem // the toolbar item for the delete button

                    widget={'dxButton'}
                    toolbar={'bottom'}
                    location={'left'}
                    options={buttonConfigDelete} />

                    

            </Popup>
            <Popup // the popup for confirming the deletion of an appointment
                visible={confirmPopupState.popupVisible}
                height={'30%'}
                width={'50%'}
                closeOnOutsideClick={false}
                onHiding={() => setConfirmPopupState({...initialConfirmPopupState})}
                title={'Stergere programarea'}
                
                contentRender={ConfirmDeletePopup} >
                    
                    <ToolbarItem // the button for confirming the deletion of an appointment
                        widget={'dxButton'}
                        toolbar={'bottom'}
                        location={'left'}
                        options={buttonConfigDeleteConfirm} />
                    
                    <ToolbarItem // the cancel button
                        
                        widget={'dxButton'}
                        toolbar={'bottom'}
                        location={'after'}
                        options={buttonConfigDeleteCancel} />

            </Popup>
            <Popup // the popup for creating appointments
                visible={createPopupState.popupVisible}
                
                width={500}
                closeOnOutsideClick={false}
                onHiding={() => setCreatePopupState({...initialFormState})}
                title={'Creare Programare'}
                contentRender={CustomAppointmentCreateForm} >
                
                <ToolbarItem // the save button
                    widget={'dxButton'}
                    toolbar={'bottom'}
                    location={'after'}
                    options={buttonConfigSave} />
                
                
            </Popup>



                
                
                

            </div>

    )
}
         

export default ExtremeCalendar;