//create an AppointmentTooltip component that will be used to display the appointment in the scheduler, with the following properties:
//id - the id of the appointment
//startDate - the start date of the appointment
//endDate - the end date of the appointment
//PatiendID - the patient of the appointment

import React from 'react';
//import parseData from '../components/Fetchtest';
import {parseDataSingle} from '../tools/FetchTools'



async function getAppointment(id) {
  const res = await fetch(`/api/appointments/${encodeURIComponent(id)}`);
  const data = await res.json();
  const result = parseDataSingle(data);
  return result;
}

export default class AppointmentTooltipCustom extends React.Component {
  constructor(props) {
    super(props);
    //console.log(props);
    this.state = {
      appointmentData: {},
    };
  }
  componentDidMount() {
    const id = this.props.data.targetedAppointmentData.id;
    
    fetch(`/api/appointments/${encodeURIComponent(id)}`,{method: "GET"})
        .then((res) => res.json())
        .then(result => {
            const appointmentData = parseDataSingle(result);
            
            this.setState({
                appointmentData: appointmentData,
                
            });
            }
        )
  }
  render() {
    //console.log(this.state);
    return (
      <div>
        Date: {this.state.appointmentData.startDate}
        <p>doctor: {this.state.appointmentData.doctorId}   </p> 
      </div>  
    )
  }
}
