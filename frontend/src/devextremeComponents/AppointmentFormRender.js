import React from 'react';
import { SelectBox, DateBox } from 'devextreme-react';
import ScrollView from 'devextreme-react/scroll-view';
import { doctorDisplayExpr, patientDisplayExpr } from './DisplayExpresions';

const AppointmentFormRender = ({ formState, dispatch, doctors, patients }) => {

    const onDoctorChange = (e) => {
        dispatch({ editData: { ...formState.editData, doctorId: e.value } });
    }

    const onPatientChange = (e) => {
        dispatch({ editData: { ...formState.editData, patientId: e.value } });
    }

    const onStartDateChange = (e) => {
        dispatch({ editData: { editData: { ...formState.editData, startDate: e.value } } });
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

export default AppointmentFormRender;