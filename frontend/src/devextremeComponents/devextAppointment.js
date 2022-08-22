import React, { useEffect,useState } from 'react';
import Query from 'devextreme/data/query';




async function getAppointment(id) {
  const res = await fetch( '/api/appointments/'+id);
  const data = await res.json();
  return data;
}

async function getDoctor(id) {
  const res = await fetch( '/api/doctors/'+id);
  const data = await res.json();
  return data;
}

async function getPatient(id) {
  const res = await fetch( '/api/patients/'+id);
  const data = await res.json();
  return data;
}


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
  
  const [appointmentData, setAppointment] = useState([]); 
  const [doctorData, setDocotor] = useState([]);
  const [patientData, setPatient] = useState([]);
  useEffect(() => {
    getAppointment(targetedAppointmentData.id).then((data) => {
      setAppointment(data);
    });
    getDoctor(targetedAppointmentData.doctorId).then((data) => {
      setDocotor(data);
    });
    getPatient(targetedAppointmentData.patientId).then((data) => {
      setPatient(data);
    });
  }, []);

  console.log(patientData);



  return (
    <div className="Appointment">
      
      <div>
        
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
  );
}