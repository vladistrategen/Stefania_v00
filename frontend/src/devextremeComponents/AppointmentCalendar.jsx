import { AppointmentCalendarContext } from "./AppointmentCalendarProvider";
import { Scheduler } from "devextreme-react";
import { Resource, View } from 'devextreme-react/scheduler';
import { parseDoctorColorData } from "../tools/FetchTools";
import AppointmentCustom from "./devextAppointment";
import AppointmentTooltipCustom from "./devextAppointmentTooltip";
import AppointmentForm from "./FormComponents/AppointmentForm";
import { useContext, useEffect } from "react";
import ActionTypes from "./ActionTypes";
import { initialFormState } from './FormComponents/InitialFormStates';
import { doctorDisplayExpr, patientDisplayExpr } from "./DisplayExpresions";
import { useState } from "react";
import { doctorsTempData, patientsTempData } from "../tempdata";
import {Popup} from "devextreme-react";

const editingoptions = {
    allowAdding: true,
    allowDeleting: true,
    allowResizing: true,
    allowDragging: true,
    allowUpdating: true,
};

const AppointmentCalendar = () => {
    const context = useContext(AppointmentCalendarContext);
    const { appointmentsState, formsVisibilityState, setFormsVisibilityState } = context;
    let doctors = appointmentsState.doctors;
    let patients = appointmentsState.patients;
    doctors = doctors === undefined ? [] : doctorsTempData;
    patients = patients === undefined ? [] : patientsTempData;
    const displayDoctorData = parseDoctorColorData(doctors);
    const appointments = appointmentsState.appointments;
    const [formState, setFormState] = useState(initialFormState);


    return (
        <>
            <Scheduler
                dataSource={appointments}
                showAllDayPanel={false}
                editing={editingoptions}
                groups={['doctorId']}
                defaultCurrentDate={new Date("2022-07-30")}
                appointmentComponent={AppointmentCustom}
                appointmentTooltipComponent={AppointmentTooltipCustom}
                onAppointmentFormOpening={(e) => {
                    console.log("e", e);
                    e.cancel = true;
                    setFormsVisibilityState({ type: ActionTypes.SET_APPOINTMENT_CREATE_FORM_VISIBILITY, payload: true });
                    setFormState({ editData: { ...formState.editData, startDate: e.appointmentData.startDate, endDate: e.appointmentData.endDate, doctorId : e.appointmentData.doctorId } });
                }}
                defaultCurrentView="Vertical Grouping">
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
            <AppointmentForm data = {formState}/>
        </>
    );
}



export default AppointmentCalendar;