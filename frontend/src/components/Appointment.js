import React from 'react';
import Query from 'devextreme/data/query';
import localization from 'devextreme/localization';
import { moviesData } from './data.js';

function getMovieById(id) {
  return Query(moviesData).filter(['id', id]).toArray()[0];
}
async function getAppointment(id) {
  const res = await fetch('127.0.0.1:8000/api/appointments/' + id);
  const data = await res.json();
  return data;
}

export default function Appointment(model) {
  const { targetedAppointmentData } = model.data;

  const appointmentData= targetedAppointmentData ? getAppointment(targetedAppointmentData.id) : null;


  return (
    <div className="Appointment">
      
      <div>
            Programare la data de {appointmentData.date} la ora {appointmentData.time} pentru {appointmentData.description}
            
      </div>
      <div>
            Pacientul {appointmentData.patient}
      </div>
      
    </div>
  );
}