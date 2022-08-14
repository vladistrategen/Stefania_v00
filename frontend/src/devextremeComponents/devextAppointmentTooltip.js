//create an AppointmentTooltip component that will be used to display the appointment in the scheduler, with the following properties:
//id - the id of the appointment
//startDate - the start date of the appointment
//endDate - the end date of the appointment
//PatiendID - the patient of the appointment

import React from 'react';






async function getAppointment(id) {
  const res = await fetch('127.0.0.1:8000/api/appointments/' + id);
  const data = await res.json();
  return data;
}

export default class AppointmentTooltipCustom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appointmentData: getAppointment(this.props.id),
    };
  }
  render() {
    
    return (
      <div>
        Date: {this.state.appointmentData.startDate}
        doctor: {this.state.appointmentData.doctorId}    
      </div>  
    )
  }
}
