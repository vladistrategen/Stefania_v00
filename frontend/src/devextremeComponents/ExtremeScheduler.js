import 'devextreme/dist/css/dx.light.css';
import '../App.css';
import React, { useEffect, useState, useMemo, useReducer, useContext } from 'react';
import Scheduler, { View, Resource } from 'devextreme-react/scheduler';

import AppointmentCustom from './devextAppointment';
import AppointmentTooltipCustom from './devextAppointmentTooltip';
import { parseDataMultiple, parseDoctorColorData, parseForRequest, base_url, getCsrfToken } from '../tools/FetchTools';
import { NumberBox } from 'devextreme-react/number-box';
import { Button } from 'devextreme-react/button';
import { TextBox } from 'devextreme-react/text-box';

import Popup, { ToolbarItem } from 'devextreme-react/popup';
import ScrollView from 'devextreme-react/scroll-view';
import DateBox from 'devextreme-react/date-box';


import notify from 'devextreme/ui/notify';
import AppointmentFormRender from './AppointmentFormRender';
import {onAppointmentFormOpening, CreateAppointmentForm} from './FormComponents/CreateAppointmentForm';
import { initialFormState, initialCreatePatientFormState, initialConfirmPopupState } from './FormComponents/InitialFormStates';

const AppoiontmentCalendarContext = React.createContext();

const AppointmentCalendar = ({ children }) => {

}

function ExtremeCalendar() {

    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [displayDoctorData, setDisplayDoctorData] = useState([]);
    const [dataWasFetched, setDataWasFetched] = useState(false);

    const [formState, dispatch] = useReducer(reducer, initialFormState);
    const [confirmPopupState, setConfirmPopupState] = useState(initialConfirmPopupState);
    const [createPatientPopupState, setCreatePatientPopupState] = useState(initialCreatePatientFormState);
    const csrftoken = getCsrfToken();
    

    const getAppointments = async () => {
        const res = await fetch('/api/appointments/');
        const data = await res.json();
        const parsedData = parseDataMultiple(data);
        setAppointments(parsedData);
    }

    const getDoctors = async () => {
        const res = await fetch('/api/doctors/');
        const data = await res.json();
        setDoctors(data);
        setDisplayDoctorData(parseDoctorColorData(data));
    }

    const getPatients = async () => {
        const res = await fetch('/api/patients/');
        const data = await res.json();
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

    const validateCreatePatientFormData = (data) => {
        if (data.last_name === "" || data.first_name === "" || data.phone_number === "" || data.birth_date === "") {
            return false;
        }
        return true;
    }

    

    // const buttonConfigSave = useMemo(() => {
    //     return {
    //         text: "Salveaza",
    //         type: "success",
    //         useSubmitBehavior: true,

    //         onClick: async () => {
    //             if (!validateCreateAppointmentFormData(formState.editData)) {
    //                 notify('Eroare! Toate campurile sunt obligatorii', 'error', 3000)
    //                 return;
    //             }
    //             if (formState.editData.id) {
    //                 const requestOptions = {
    //                     method: 'PUT',
    //                     headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
    //                     body: JSON.stringify(parseForRequest(formState.editData))
    //                 };
    //                 await fetch(base_url + '/' + formState.editData.id + '/', requestOptions)
    //                     .then(response => response.json())
    //                     .then(data => {

    //                         getAppointments();
    //                         dispatch({ popupVisible: false });
    //                         notify('Programare modificata', 'success', 3000);
    //                     });
    //             } else {
    //                 const requestOptions = {
    //                     method: 'POST',
    //                     headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
    //                     body: JSON.stringify(parseForRequest(createPopupState.editData))
    //                 };
    //                 await fetch(base_url + '/', requestOptions)
    //                     .then(response => response.json())
    //                     .then(data => {
    //                         console.log("Post request data:", data)
    //                         getAppointments();
    //                         ;
    //                     })
    //                     .then(setCreatePopupState({ ...createPopupState, popupVisible: false }))
    //                     .then(notify('Programare creata', 'success', 3000))
    //             }

    //         }
    //     };


    // }, [, formState, createPopupState]);

    const buttonConfigDeleteCancel = useMemo(() => {
        return {
            text: "Cancel",
            type: "default",
            onClick: () => {
                dispatch({ popupVisible: false })
                    .then(setConfirmPopupState({ popupVisible: false }));
            }
        };
    }, [confirmPopupState]);

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
    }, [confirmPopupState, formState]);

    const buttonConfigDeleteConfirm = useMemo(() => {
        return {

            text: "Sterge",
            type: "danger",

            useSubmitBehavior: true,
            onClick: async () => {
                console.log("delete:", formState)
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
    }, [confirmPopupState, formState]);

    const buttonConfigCreatePatient = useMemo(() => {
        return {
            text: "Salveaza",
            type: "success",
            useSubmitBehavior: true,
            onClick: async () => {
                if (validateCreatePatientFormData(createPatientPopupState.editData)) {
                    console.log("create patient:", createPatientPopupState)
                    const parsedData = {
                        first_name: createPatientPopupState.editData.first_name,
                        last_name: createPatientPopupState.editData.last_name,
                        phone_number: createPatientPopupState.editData.phone_number,
                        birth_date: createPatientPopupState.editData.birth_date.toISOString().slice(0, 10),
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
                            setCreatePatientPopupState({ ...createPatientPopupState, popupVisible: false })
                            notify('Pacient creat', 'success', 3000)
                        })
                } else {
                    notify('Eroare! Toate campurile sunt obligatorii', 'error', 3000)
                }

            }
        };
    }, [createPatientPopupState]);

    function reducer(state, action) {
        return { ...state, ...action };
    }



    function CreatePatientForm() {
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

    function ConfirmDeletePopup() {
        return (
            <ScrollView width="100%" height="100%">
                <div className='text-group'>
                    <h1 style={{ textAlign: 'center', verticalAlign: 'middle' }}>Sunteti sigur ca doriti sa stergeti programarea?</h1>

                </div>

            </ScrollView>
        );
    }

    
    const editingoptions = {
        allowAdding: true,
        allowDeleting: true,
        allowResizing: true,
        allowDragging: true,
        allowUpdating: true,
    };

    function onHiding(e) {
        dispatch({ popupVisible: false });
    }

    if (dataWasFetched === false)
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
                onAppointmentFormOpening={(e) => onAppointmentFormOpening(e,dispatch,confirmPopupState,)}
                defaultCurrentView="Vertical Grouping"
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
            {/* <Popup // the popup for editing appointments
                visible={formState.popupVisible}
                width={500}
                closeOnOutsideClick={true}
                onHiding={onHiding}
                title={formState.popupTitle}
                contentRender={() => <AppointmentFormRender
                    formState={formState}
                    dispatch={dispatch}
                    doctors={doctors}
                    patients={patients}

                />}
            >
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



            </Popup> */}
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
            <CreateAppointmentForm 
                formState={formState}
                getAppointments={getAppointments}
            />
            {/* <Popup // the popup for creating appointments

                visible={createPopupState.popupVisible}

                width={500}
                closeOnOutsideClick={false}
                onHiding={() => setCreatePopupState({ ...initialFormState })}
                title={'Creare Programare'}
                contentRender={CreateAppointmentFormRenderer} >

                <ToolbarItem // the save button
                    widget={'dxButton'}
                    toolbar={'bottom'}
                    location={'after'}
                    options={buttonConfigSave} />
            </Popup> */}
            <Popup /* the popup for adding patients */
                visible={createPatientPopupState.popupVisible}
                width={500}
                hideOnOutsideClick={false}
                onHiding={() => setCreatePatientPopupState({ ...initialCreatePatientFormState })}
                title={'Adauga Pacient'}
                contentRender={CreatePatientForm} >

                <ToolbarItem // the save button
                    widget={'dxButton'}
                    toolbar={'bottom'}
                    location={'after'}
                />

                <ToolbarItem // add patient button located on the lower middle part of the popup
                    widget={'dxButton'}
                    toolbar={'bottom'}
                    location={'center'}
                    options={buttonConfigCreatePatient}
                />

            </Popup>

            <div>
                {/* <Button
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
                /> */}
            </div>
        </div>
    )

}


export default ExtremeCalendar;