import React, {useState,useEffect} from "react";


// define a function to parse the data from the server and return an array of appointments as json objects
const  parseDataMultiple = (data) => {
    let parsedData = [];
    
   
    for (let i = 0; i < data.length; i++) {
        const parsedStartDate=new Date(data[i].date+"T"+data[i].time+".000Z");
        const parsedEndDate=new Date();
        parsedEndDate.setTime(parsedStartDate.getTime()+parseInt(data[i].duration_in_minutes)*60000);
        parsedData.push({
            "id": data[i].id,
            "description": data[i].description,
            "startDate": parsedStartDate.toISOString(),
            "endDate": parsedEndDate.toISOString(),
            "doctorId": data[i].doctor,
            "patientId": data[i].patient,
            "confirmation_status": data[i].confirmation_status,
            "completed": data[i].completed,
        });
    }
    return parsedData;
}

const parseDataSingle = (data) => {
    const parsedStartDate = new Date(data.date + "T" + data.time + ".000Z");
    const parsedEndDate = new Date();
    parsedEndDate.setTime(parsedStartDate.getTime() + parseInt(data.duration_in_minutes) * 60000);
    return({
      "id": data.id,
      "description": data.description,
      "startDate": parsedStartDate.toISOString(),
      "endDate": parsedEndDate.toISOString(),
      "doctorId": data.doctor,
      "patientId": data.patient,
      "confirmation_status": data.confirmation_status,
      "completed": data.completed,
      "price": data.price,
    });
  }

const parseForRequest = (data) => {
    const parsedStartDate = new Date(data.startDate);
    const parsedEndDate = new Date(data.endDate);
    const duration = (parsedEndDate.getTime() - parsedStartDate.getTime()) / 60000;

    return {
    "id": data.id,
    "date": parsedStartDate.toISOString().split("T")[0],
    "time": parsedStartDate.toISOString().split("T")[1].split(".")[0],
    "completed": data.completed,
    "description": data.description,
    "duration_in_minutes": duration,
    "price": data.price,
    "confirmation_status": data.confirmation_status,
    "doctor": data.doctorId,
    "patient": data.patientId
    }
}
            
/*
const Fetchtest = () => {
    const [appointments, setAppointments] = useState([]);
    useEffect(() => {
        getAppointments()
    }, []);
    
    let getAppointments = async () => {
        const res = await fetch('http://127.0.0.1:8000/api/appointments');
        const data = await res.json();
        
        const parsedData = parseDataMultiple(data);
        //console.log(parsedData);
        setAppointments(parsedData);

    }
    
    return (
        <div>
            {appointments.map(appointment => (
                <div key={appointment.id}>
                    {appointment.title}
                </div>
            ))}
        </div>
    );


}*/

// make a function to fetch the data from the server, with request options, appointment id, and url as parameters

const makeRequest = async (options, id, url) => {
    const res = await fetch(url + '/' + id + '/',  options);
    const data = await res.json();
    return data;
}

const parseDoctorColorData = (data) => {
    let parsedData = [];
    for(let i=0;i<data.length;i++){
        parsedData.push({
            "text": data[i].first_name + ' ' + data[i].last_name,
            "id": data[i].id,
            "color": data[i].preferred_color,
        })
    }
    return parsedData;
}
export {parseDataMultiple,parseDataSingle,parseForRequest,makeRequest,parseDoctorColorData};
