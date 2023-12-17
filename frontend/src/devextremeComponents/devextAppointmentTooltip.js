import React from 'react';
import {parseDataSingle} from '../tools/FetchTools'

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
    return (
      <div>
        Date: {this.state.appointmentData.startDate}
        <p>doctor: {this.state.appointmentData.doctorId}   </p> 
      </div>  
    )
  }
}
