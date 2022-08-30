import notify from "devextreme/ui/notify";
import React, {useReducer,useRef,useMemo,useEffect,useState}from "react";
import {SelectBox, Show} from "devextreme-react/select-box";
import {DateBox} from "devextreme-react/date-box";  
import ScrollView from "devextreme-react/scroll-view";
import { formatDate } from "devextreme/localization";




 export default function CustomAppointmentForm(props)  {

    const [state, dispatch] = useState();
    const [appointmentData, setAppointment] = useState([]);
    //const [tempdata, setTempdata] = useState([]);
    const [doctorData, setDocotor] = useState([]);
    const [patientData, setPatient] = useState([]);

    
    dispatch(props.initialState)
    
    
    

    const buttonConfig = useMemo(() => {
        return {
            text: "Save",
            type: "default",
            useSubmitBehavior: true,
            onClick: () => {
                //getAppointment(state.editData.id)
                
                

            }
        };
    } , [state]);

    


    const onDoctorChange = (e) => {
        dispatch({editData: {...state.editData, doctorId: e.value}});
    }

    const onPatientChange = (e) => {
        dispatch({editData: {...state.editData, patientId: e.value}});
    }

    const onStartDateChange = (e) => {
        dispatch({editData: {...state.editData, startDate: e.value}});
    }

    return (
        <ScrollView width="100%" height="100%">
            <div>
                
                
                <div className="dx-field-label">
                    <b>{formatDate(state.editData.startDate, "shortTime")} - {formatDate(state.editData.endDate, "shortTime")}</b>
                </div>

                <div className="dx-field-label"><b>Price ($):</b></div>
                <div className="dx-field-label">
                    
                </div>

                <SelectBox
                    className="dx-field-label"
                    dataSource={patientData}
                    width={400}
                    placeholder="Pick a row"
                    ></SelectBox>

                <SelectBox
                    className="dx-field-label"
                    dataSource={doctorData}
                    width={400}
                    placeholder="Pick a seat"
                    ></SelectBox>
                
                <DateBox type="datetime"/>

            </div>
        </ScrollView>
    );
}