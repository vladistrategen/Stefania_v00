import { createContext, useEffect, useReducer, useState } from "react";
import ActionTypes from "./ActionTypes";
import { fetchAppointments, fetchDoctors, fetchPatients } from "../services/api.service";
import notify from 'devextreme/ui/notify';

export const AppointmentCalendarContext = createContext();
export const FormsVisibilityContext = createContext();

const initialCalendarState = {
    patients: [],
    appointments: [],
    doctors: [],
    currentDate: new Date(),
    dataFetched: false,
};

const initialFormsVisibilityState = {
    createAppointmentFormVisible: false,
    editAppointmentFormVisible: false,
    createPatientFormVisible: false,
}

const appointmentsDataReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.SET_APPOINTMENTS:
            return { ...state, appointments: action.payload };
        case ActionTypes.ADD_APPOINTMENT:
            //handle
            break;
        case ActionTypes.EDIT_APPOINTMENT:
            //handle
            break;
        case ActionTypes.DELETE_APPOINTMENT:
            //handle
            break;
        case ActionTypes.SET_PATIENTS:
            return { ...state, patients: action.payload };
        case ActionTypes.ADD_PATIENT:
            //handle
            break;
        case ActionTypes.SET_DOCTORS:
            return { ...state, doctors: action.payload };
        case ActionTypes.SET_DATA_WAS_FETCHED:
            return { ...state, dataFetched: action.payload };
        default:
            return state;
    }
}

const formsVisibilityReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.SET_APPOINTMENT_CREATE_FORM_VISIBILITY:
            return { ...state, createAppointmentFormVisible: action.payload };
        case ActionTypes.SET_APPOINTMENT_EDIT_FORM_VISIBILITY:
            return { ...state, editAppointmentFormVisible: action.payload };
        case ActionTypes.SET_PATIENT_CREATE_FORM_VISIBILITY:
            return { ...state, createPatientFormVisible: action.payload };
        default:
            return state;
    }
}
export const AppointmentCalendarProvider = ({ children }) => {
    const [appointmentsState, setAppointmentsState] = useReducer(appointmentsDataReducer, initialCalendarState);
    const [formsVisibilityState, setFormsVisibilityState] = useReducer(formsVisibilityReducer, initialFormsVisibilityState);
    const [dataFetched, setDataFetched] = useState(false);
    useEffect(() => {
        const loadData = async () => {
            try{
                const appointments = await fetchAppointments();
                setAppointmentsState({ type: ActionTypes.SET_APPOINTMENTS, payload: appointments });
                
                const patients = await fetchPatients();
                setAppointmentsState({ type: ActionTypes.SET_PATIENTS, payload: patients });
    
                const doctors = await fetchDoctors();
                setAppointmentsState({ type: ActionTypes.SET_DOCTORS, payload: doctors });
            }
            catch(err){
                notify("Eroare la citirea din baza de date", 'error', 3000);
                console.log(err);
            }
        }

        loadData().then(() => { setDataFetched(true) });
    }
    , []);

    const contextValue = {
        appointmentsState,
        setAppointmentsState,
        formsVisibilityState,
        setFormsVisibilityState,
    }

    if (!dataFetched)
        return <div><h1>Loading...</h1></div>
    return (
        <AppointmentCalendarContext.Provider value={contextValue}>
            {children}
        </AppointmentCalendarContext.Provider>
    );
}
