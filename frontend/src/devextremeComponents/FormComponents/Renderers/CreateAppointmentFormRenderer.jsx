import { ScrollView } from 'devextreme-react/scroll-view';
import { SelectBox } from 'devextreme-react/select-box';
import { DateBox } from 'devextreme-react/date-box';
import { doctorDisplayExpr, patientDisplayExpr } from '../../DisplayExpresions';

export const CreateAppointmentFormRenderer = ({ doctors, patients, formState, setFormState }) => {
    console.log("formState", formState);
    const onDoctorChange = (e) => {
        setFormState({ editData: { ...formState.editData, doctorId: e.value } });
    }

    const onPatientChange = (e) => {
        setFormState({ editData: { ...formState.editData, patientId: e.value } });
    }

    const onStartDateChange = (e) => {
        setFormState({ editData: { editData: { ...formState.editData, startDate: e.value } } });
    }
    const onDurationChange = (e) => {
        const newvalue = new Date(formState.editData.startDate).getTime() + e.value * 60000;
        const newEndDate = new Date(newvalue);
        setFormState({ ...formState, editData: { ...formState.editData, endDate: newEndDate } });
    }

    const getDoctor = (id) => {
        return doctors.find(doctor => doctor.id === id);
    }
    const getPatient = (id) => {
        return patients.find(patient => patient.id === id);
    }
    console.log("formState", formState);
    return (
        <div>
            <ScrollView width="100%" height="100%">
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
