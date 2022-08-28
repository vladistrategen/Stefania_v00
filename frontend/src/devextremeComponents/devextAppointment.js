import React, { useEffect,useState } from 'react';
import Query from 'devextreme/data/query';
import {parseDataSingle} from '../tools/FetchTools';







function parseDate(date){
  const parsedDate=new Date(date);
  return parsedDate.getHours()+":"+parsedDate.getMinutes();
}



export default function AppointmentCustom(model) {
  const { targetedAppointmentData } = model.data;
  //console.log(targetedAppointmentData);
  //const appointmentData= getAppointment(targetedAppointmentData.id) || {};
  //const doctorData= getDoctor(targetedAppointmentData.doctorId) || {};
  //const patientData= getPatient(targetedAppointmentData.patientId) || {};
  //console.log(targetedAppointmentData);
  const [appointmentData, setAppointment] = useState([]); 
  const [doctorData, setDocotor] = useState([]);
  const [patientData, setPatient] = useState([]);

  async function getAppointment(id) {
    const res = await fetch( `/api/appointments/${encodeURIComponent(id)}`);
    const data = await res.json();
    const parsedData=parseDataSingle(data);
    setAppointment(parsedData);
  }
  
  async function getDoctor(id) {
    //console.log('doctorrequest');
    const res = await fetch( `/api/doctors/${encodeURIComponent(id)}`);
    const data = await res.json();
    setDocotor(data);
  }
  
  async function getPatient(id) {
    //console.log('patientrequest');
    const res = await fetch( `/api/patients/${encodeURIComponent(id)}`);
    const data = await res.json();
    setPatient(data);
  }


  useEffect(() => {
    getAppointment(targetedAppointmentData.id);
    getDoctor(targetedAppointmentData.doctorId);
    getPatient(targetedAppointmentData.patientId);
  } , []);


  //console.log("appointmentData:",appointmentData);
  //console.log( targetedAppointmentData);
  //console.log(doctorData);
  //console.log(patientData);
  

  

  

  

  
  //console.log(appointmentData);
  return (
    <div className="Appointment">
      
      <div>
        programare:{appointmentData.id}
        
      {appointmentData.description}
      </div>
      <div>

      
            Pacientul {patientData.first_name + patientData.last_name} cu nr de telefon: {patientData.phone_number } nascut pe:{patientData.birth_date}
            este programat la doctorul {doctorData.first_name + " " + doctorData.last_name} 
      </div>
      <div >
      la ora: {parseDate(targetedAppointmentData.startDate)}
        
        </div>     
    </div>
  )

  



  

}

