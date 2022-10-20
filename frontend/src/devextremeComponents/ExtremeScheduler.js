import 'devextreme/dist/css/dx.light.css';
import '../App.css';
import React, { useEffect,useState,useMemo, useReducer } from 'react';
import Scheduler, { View, Resource } from 'devextreme-react/scheduler';

import AppointmentCustom from './devextAppointment';
import AppointmentTooltipCustom from './devextAppointmentTooltip'; 
import {parseDataMultiple, parseDoctorColorData,parseForRequest,} from '../tools/FetchTools';
import { SelectBox} from 'devextreme-react/select-box';
import {NumberBox} from 'devextreme-react/number-box';
import { Button } from 'devextreme-react/button';
import {TextBox} from 'devextreme-react/text-box';

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
    const initialCreatePatientFormState = {
        popupVisible: false,
        popupTitle: "Adauga pacient",
        editData: {
            "last_name": "",
            "first_name": "",
            "phone_number": "",
            'birth_date': new Date(),
        }
    };
    const initialConfirmPopupState={
        popupVisible: false,
    }
    

    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [displayDoctorData, setDisplayDoctorData] = useState([]);
    const [dataWasFetched, setDataWasFetched] = useState(false);

    const [formState, dispatch] = useReducer(reducer, initialFormState);
    const [confirmPopupState, setConfirmPopupState] = useState(initialConfirmPopupState);
    const [createPopupState, setCreatePopupState] = useState(initialFormState);
    const [createPatientPopupState, setCreatePatientPopupState] = useState(initialCreatePatientFormState);
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
        setDisplayDoctorData(parseDoctorColorData(data));
        console.log('displayDoctorData',parseDoctorColorData(data));
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
        getPatients();
        getDoctors().then(() => {
            setDataWasFetched(true); 
            
        });
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
    } , [,formState,createPopupState]);

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
        
        return {
            text: "Sterge",
            type: "danger",
            useSubmitBehavior: true,
            onClick: async () => {
                await fetch(base_url + '/' + formState.editData.id + '/', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
                })
                    .then(() => {
                        window.location.reload();
                    })
                    .then(notify('Programare stearsa', 'success', 3000))        
            }
        };
    } , [confirmPopupState,formState]);


    const buttonConfigDeleteConfirm = useMemo(() => {
        
        
        return {

            text: "Sterge",
            type: "danger",
            
            useSubmitBehavior: true,
            onClick: async () => {
                console.log("delete:",formState)
                if (formState.editData.id) {
                    const requestOptions = {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
                        body: JSON.stringify(parseForRequest(formState.editData))
                    };
                    await fetch(base_url + '/' + formState.editData.id + '/', requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            notify('Programare stearsa', 'success', 3000);
                        })
                        .finally(setConfirmPopupState({ popupVisible: false }))
                        .finally(dispatch({ popupVisible: false }));

                }
                else {
                    setConfirmPopupState({ popupVisible: false })
                    notify('Eroare! Nu exista programare', 'error', 3000);
                    dispatch({ popupVisible: false });
                }

            }

        };
    } , [confirmPopupState,formState]);
    
    const buttonConfigCreatePatient = useMemo(() => {
        return {
            text: "Salveaza",
            type: "success",
            useSubmitBehavior: true,
            onClick: async () => {
                console.log("create patient:",createPatientPopupState)
                const parsedData={
                    first_name:createPatientPopupState.editData.first_name,
                    last_name:createPatientPopupState.editData.last_name,
                    phone_number:createPatientPopupState.editData.phone_number,
                    // birth date formatted from mm/dd/yyyy to yyyy-mm-dd
                    birth_date:createPatientPopupState.editData.birth_date.toISOString().slice(0, 10),
                }
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
                    body: JSON.stringify(parsedData)
                };
                
                await fetch('/api/patients/', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        getPatients();
                        setCreatePatientPopupState({...createPatientPopupState,popupVisible:false})
                        notify('Pacient creat', 'success', 3000)
                    })
            }
        };
    } , [createPatientPopupState]);

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
            return item.last_name + " " + item.first_name +' - ' + item.birth_date;
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
    
    function CustomCreatePatientForm() {
        const onFirstNameChange = (e) => {
            setCreatePatientPopupState({ ...createPatientPopupState, editData: { ...createPatientPopupState.editData, first_name: e.value } })
        }
        const onPhoneChange = (e) => {
            setCreatePatientPopupState({ ...createPatientPopupState, editData: { ...createPatientPopupState.editData, phone_number: e.value } })
        }
        const onBirthDateChange = (e) => {
            setCreatePatientPopupState({ ...createPatientPopupState, editData: { ...createPatientPopupState.editData, birth_date: e.value } })
        }
        const onLastNameChange = (e) => {
            setCreatePatientPopupState({ ...createPatientPopupState, editData: { ...createPatientPopupState.editData, last_name: e.value } })
        }


        return (
            <div>
                <ScrollView width="100%" height="100%">
                    <div className='text-group'>
                        <h1>Creaza un nou pacient</h1>
                    </div>
                    <div className='dx-field'>
                        <div className="dx-field-label" style={{ marginTop: '10px' }}> Nume de familie:</div>
                        <div className='dx-field-value'>
                            <TextBox
                                style={{ marginTop: '10px' }}
                                placeholder="Nume de familie:"
                                onValueChanged={onLastNameChange}
                                value={createPatientPopupState.editData.last_name}
                            ></TextBox>

                        </div>
                    </div>
                    <div className='dx-field'>
                        <div className="dx-field-label" style={{ marginTop: '10px' }}> Prenume:</div>
                        <div className='dx-field-value'>
                            <TextBox
                                style={{ marginTop: '10px' }}
                                placeholder="Prenume:"
                                onValueChanged={onFirstNameChange}
                                value={createPatientPopupState.editData.first_name}
                            ></TextBox>
                        
                        </div>
                    </div>
                    <div className='dx-field'>
                        <div className="dx-field-label" style={{ marginTop: '10px' }}> Telefon:</div>
                        <div className='dx-field-value'>
                            <NumberBox 
                                placeholder='0722 123 456'
                                style={{ marginTop: '10px' }}
                                onValueChanged={onPhoneChange}
                                value={createPatientPopupState.editData.phone_number}
                            ></NumberBox>
                        </div>
                    </div>
                    <div className='dx-field'>
                        <div className="dx-field-label" style={{ marginTop: '10px' }}> Data nasterii:</div>
                        <div className='dx-field-value'>
                            <DateBox
                                style={{ marginTop: '10px' }}
                                placeholder="Data nasterii:"
                                type="date"
                                onValueChanged={onBirthDateChange}
                                value={createPatientPopupState.editData.birth_date}
                            ></DateBox>
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
            endDate:e.appointmentData.endDate,doctorId:e.appointmentData.doctorId}, popupTitle: 'Creare programare'})
           
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
    
    
    if(dataWasFetched===false)
        return <div><h1>Loading...</h1></div>
    return (
        <div>
            <Scheduler
                dataSource={appointments}
                showAllDayPanel={false}
                editing={editingoptions}
                groups={['doctorId']}
                defaultCurrentDate={new Date("2022-07-30")}
                appointmentComponent={AppointmentCustom}
                appointmentTooltipComponent={AppointmentTooltipCustom}
                onAppointmentFormOpening={onAppointmentFormOpeningc}
                defaultCurrentView="day"
                views={['day', 'week',  'Vertical Grouping']}
            >
                
                <Resource
                    fieldExpr='doctorId'
                    dataSource={displayDoctorData}
                    label='Doctor'
                />
                <View
                    name="Vertical Grouping"
                    type="day"
                    groupOrientation="vertical"
                    cellDuration={60}
                    
                />
                <View
                    name="Horizontal Grouping"
                    type="day"
                    groupOrientation="horizontal"
                    cellDuration={30}
                    
                />
            </Scheduler>
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
                onHiding={() => setConfirmPopupState({ ...initialConfirmPopupState })}
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
                onHiding={() => setCreatePopupState({ ...initialFormState })}
                title={'Creare Programare'}
                contentRender={CustomAppointmentCreateForm} >

                <ToolbarItem // the save button
                    widget={'dxButton'}
                    toolbar={'bottom'}
                    location={'after'}
                    options={buttonConfigSave} />
            </Popup>
            <Popup /* the popup for adding patients */
                visible={createPatientPopupState.popupVisible}
                width={500}
                closeOnOutsideClick={false}
                onHiding={() => setCreatePatientPopupState({ ...initialCreatePatientFormState })}
                title={'Adauga Pacient'}
                contentRender={CustomCreatePatientForm} >

                <ToolbarItem // the save button
                    widget={'dxButton'}
                    toolbar={'bottom'}
                    location={'after'} />

                <ToolbarItem // add patient button located on the lower middle part of the popup
                    widget={'dxButton'}
                    toolbar={'bottom'}
                    location={'center'}
                    options={buttonConfigCreatePatient} />



            </Popup>




            <div>

                <Button
                    className='btn btn-primary'
                    text="Adauga pacient"
                    type="default"
                    stylingMode="contained"
                    icon="plus"
                    onClick={() => {
                        setCreatePatientPopupState({
                            ...createPatientPopupState, popupVisible: true, editData: {
                                ...createPatientPopupState.editData, startDate: createPopupState.editData.startDate,
                                endDate: createPopupState.editData.endDate
                            }, popupTitle: 'Creare programare'
                        })
                    }}
                    style={{ position: 'fixed', bottom: '30px', right: '30px', borderRadius: '8px', backgroundColor: '#2196f3', color: 'white', fontFamily: 'Helvetica', fontSize: '20px' }}
                />
            </div>




        </div>
    )


}
         

export default ExtremeCalendar;