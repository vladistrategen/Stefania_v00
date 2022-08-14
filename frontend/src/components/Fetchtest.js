import React, {useState,useEffect} from "react";


// define a function to parse the data from the server and return an array of appointments as json objects
function parseData(data) {
    let parsedData = [];
    
   
    for (let i = 0; i < data.length; i++) {
        const parsedStartDate=new Date(data[i].date+"T"+data[i].time+".000Z");
        const parsedEndDate=new Date();
        parsedEndDate.setTime(parsedEndDate.getTime()+parseInt(data[i].duration_in_minutes)*60000);
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


            

const Fetchtest = () => {
    const [appointments, setAppointments] = useState([]);
    useEffect(() => {
        getAppointments()
    }, []);

    let getAppointments = async () => {
        const res = await fetch('http://127.0.0.1:8000/api/appointments');
        const data = await res.json();
        
        const parsedData = parseData(data);
        console.log(parsedData);
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


}

export default parseData;
