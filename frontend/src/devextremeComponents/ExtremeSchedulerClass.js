import React from "react";

import Scheduler from "devextreme-react/scheduler";
import {parseDataMultiple} from "../tools/FetchTools";
import AppointmentCustom from "./devextAppointment";
import AppointmentTooltipCustom from "./devextAppointmentTooltip";
export default class ExtremeCalendarClassComponent extends React.Component{
    constructor(props){
        super(props);
        this.state={
            appointmentData:[],
            patientData:[],
            doctorData:[],
        };
        this.onAllowAddingChanged = this.onAllowAddingChanged.bind(this);
        this.onAllowDeletingChanged = this.onAllowDeletingChanged.bind(this);
        this.onAllowResizingChanged = this.onAllowResizingChanged.bind(this);
        this.onAllowDraggingChanged = this.onAllowDraggingChanged.bind(this);
        this.onAllowUpdatingChanged = this.onAllowUpdatingChanged.bind(this);
        
            
    }
    state={
        appointmentData:[],
        doctorData:[],
        patientData:[],
    }
    editingoptions={
        allowAdding: true,
        allowDeleting: true,
        allowResizing: true,
        allowDragging: true,
        allowUpdating: true,
    }
    componentDidMount(){
        fetch("/api/appointments",{method: "GET"})
        .then((res) => res.json())
        .then(result => {
            const appointmentData = parseDataMultiple(result);
            this.setState({
                appointmentData: appointmentData,
                
            });
            }
        )
        fetch("/api/patients",{method: "GET"})
        .then((res) => res.json())
        .then(result => {
            const patientData = result;
            this.setState({
                patientData: patientData,
                
            });
            }
        )
        fetch("/api/doctors",{method: "GET"})
        .then((res) => res.json())
        .then(result => {
            const doctorData = result;
            this.setState({
                doctorData: doctorData,
                
            });
            }
        )
    }
    

    
    

    render(){
        
        return(
            <Scheduler
                dataSource={this.state.appointmentData}
                defaultCurrentDate="2022/08/30"
                appointmentComponent={AppointmentCustom}
                appointmentTooltipComponent={AppointmentTooltipCustom}
                //onAppointmentFormOpening={this.onAppointmentFormOpeningc}
                editing={this.editingoptions}

            />
        )
    }

    /*
    onAppointmentFormOpeningc = (e) => {
        const {form} =e;
        // make select boxes for doctors and patients larger
        form.option('items', [{
            label: {text: 'Doctor'},
            editorType: 'dxSelectBox',
            dataField: 'doctorId',
            
            editorOptions: {
                
                dataSource: doctors,
                displayExpr: (item) => {return 'Dr. '+ item.first_name + ' ' + item.last_name},
                valueExpr: 'id',
                searchEnabled: true,
                // TODO: make data update when doctor is changed

            }
        }, {
            label: {text: 'Patient'},
            editorType: 'dxSelectBox',
            dataField: 'patientId',
            // make select boxes for doctors and patients larger
            
            editorOptions: {
                //width: 300,
                searchEnabled: true,
                dataSource: patients,
                displayExpr: (item) => {return item.middle_name==null? item.last_name + ' ' + item.first_name + ' - ' + item.birth_date :
                                        item.last_name + ' ' + item.first_name + ' ' + item.middle_name + ' - ' + item.birth_date},
                valueExpr: 'id'
            }
        }]);
    }*/


    onAllowAddingChanged(e) {
        this.setState({ allowAdding: e.value });
      }
    
      onAllowDeletingChanged(e) {
        this.setState({ allowDeleting: e.value });
      }
    
      onAllowResizingChanged(e) {
        this.setState({ allowResizing: e.value });
      }
    
      onAllowDraggingChanged(e) {
        this.setState({ allowDragging: e.value });
      }
    
      onAllowUpdatingChanged(e) {
        this.setState({ allowUpdating: e.value });
      }
    
      
    
    
}