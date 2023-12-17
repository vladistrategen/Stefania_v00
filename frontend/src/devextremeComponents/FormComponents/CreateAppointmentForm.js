import { React, useState, useMemo } from 'react';
import { SelectBox, DateBox, NumberBox } from 'devextreme-react';
import Popup, { ToolbarItem } from 'devextreme-react/popup';
import ScrollView from 'devextreme-react/scroll-view';
import { doctorDisplayExpr, patientDisplayExpr } from '../DisplayExpresions';
import { initialFormState } from './InitialFormStates';
import { parseForRequest, base_url, getCsrfToken } from '../../tools/FetchTools';
import notify from 'devextreme/ui/notify';

function CreateAppointmentFormRenderer({ doctors, patients }) {

    const [createPopupState, setCreatePopupState] = useState(initialFormState);

    const onDoctorChange = (e) => {
        setCreatePopupState({ ...createPopupState, editData: { ...createPopupState.editData, doctorId: e.value } })
    }
    const onPatientChange = (e) => {
        setCreatePopupState({ ...createPopupState, editData: { ...createPopupState.editData, patientId: e.value } });
    }
    const onStartDateChange = (e) => {
        setCreatePopupState({ ...createPopupState, editData: { ...createPopupState.editData, startDate: e.value } });
    }
    
    const onDurationChange = (e) => {
        const newvalue = new Date(createPopupState.editData.startDate).getTime() + e.value * 60000;
        const newEndDate = new Date(newvalue);
        setCreatePopupState({ ...createPopupState, editData: { ...createPopupState.editData, endDate: newEndDate } });
    }
    const getMinutes = (startDate, endDate) => {
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
                                value={getMinutes(createPopupState.editData.startDate, createPopupState.editData.endDate)}
                            ></NumberBox>
                        </div>
                    </div>

                </div>
            </ScrollView>
        </div>
    );
}

const csrftoken = getCsrfToken();

const CreateAppointmentForm = ({formState, getAppointments}) => {

    const [createPopupState, setCreatePopupState] = useState(initialFormState);
    const buttonConfigSave = useMemo(() => {
        return {
            text: "Salveaza",
            type: "success",
            useSubmitBehavior: true,
    
            onClick: async () => {
                if (!validateCreateAppointmentFormData(formState.editData)) {
                    notify('Eroare! Toate campurile sunt obligatorii', 'error', 3000)
                    return;
                }
                {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
                        body: JSON.stringify(parseForRequest(createPopupState.editData))
                    };
                    await fetch(base_url + '/', requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            console.log("Post request data:", data)
                            getAppointments();
                        })
                        .then(setCreatePopupState({ ...createPopupState, popupVisible: false }))
                        .then(notify('Programare creata', 'success', 3000))
                }
    
            }
        };
    }, [, formState, createPopupState]);
    

    return (
        <div>
            <Popup // the popup for creating appointments
                visible={createPopupState.popupVisible}

                width={500}
                hideOnOutsideClick={false}
                onHiding={() => setCreatePopupState({ ...initialFormState })}
                title={'Creare Programare'}
                contentRender={CreateAppointmentFormRenderer} >

                <ToolbarItem // the save button
                    widget={'dxButton'}
                    toolbar={'bottom'}
                    location={'after'}
                    options={buttonConfigSave} />
            </Popup>
        </div>
    );
}

function onAppointmentFormOpening(e, confirmPopupState, setCreatePopupState) {

    e.cancel = true;

    setCreatePopupState({
        ...confirmPopupState, popupVisible: true, editData: {
            ...confirmPopupState.editData, startDate: e.appointmentData.startDate,
            endDate: e.appointmentData.endDate, doctorId: e.appointmentData.doctorId
        }, popupTitle: 'Creare programare'
    })
}


const validateCreateAppointmentFormData = (data) => {
    if (
        data.startDate === "" ||
        data.patientId === 0 ||
        data.doctorId === 0
    ) {
        return false;
    }
    return true;
}

export { CreateAppointmentForm, onAppointmentFormOpening};