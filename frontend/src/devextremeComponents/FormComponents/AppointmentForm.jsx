
import { AppointmentCalendarContext } from "../AppointmentCalendarProvider";
import { useContext, useEffect, useState } from 'react';
import { initialFormState } from './InitialFormStates';
import Popup, { ToolbarItem } from 'devextreme-react/popup';
import ActionTypes from '../ActionTypes';
import { doctorsTempData, patientsTempData } from '../../tempdata';
import { CreateAppointmentFormRenderer } from './Renderers/CreateAppointmentFormRenderer';

const AppointmentForm = ({ data }) => {
    const formState = data ? data : initialFormState;

    const { appointmentsState, formsVisibilityState, setFormsVisibilityState, } = useContext(AppointmentCalendarContext);

    const doctors = /*appointmentsState.doctors || */ doctorsTempData;
    const patients = /* appointmentsState.patients || */ patientsTempData;

    const [createAppointmentFormState, setFormState] = useState(formState);

    useEffect(() => {
        if (data) {
            setFormState(data);
        }
    }, [data]);

    return (
        <Popup
            visible={formsVisibilityState.createAppointmentFormVisible}
            hideOnOutsideClick={true}
            width={500}
            title={'Creare Programare'}
            onHiding={() => {
                setFormsVisibilityState({ type: ActionTypes.SET_APPOINTMENT_CREATE_FORM_VISIBILITY, payload: false }); setFormState(initialFormState);
            }}
            contentRender={() => CreateAppointmentFormRenderer({ doctors, patients, formState: createAppointmentFormState, setFormState })}>

            <ToolbarItem // the toolbar item for the save button
                widget="dxButton"
                toolbar="bottom"
                location={'after'}
            // options={buttonConfigSave} 
            />
            <ToolbarItem // the toolbar item for the delete button

                widget={'dxButton'}
                toolbar={'bottom'}
                location={'left'}
            // options={buttonConfigDelete} 
            />


        </Popup>
    );
};

export default AppointmentForm;