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

const base_url = '/api/appointments';

const getCsrfToken = () => {
    const token = document.cookie.split(';').find(c => c.trim().startsWith('csrftoken='));
    if (token) {
        return token.split('=')[1];
    }
}

const getMinutes = (startDate, endDate) => {
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    return parseInt((d2.getTime() - d1.getTime()) / 60000);
}

export {parseDataMultiple,parseDataSingle,parseForRequest,makeRequest,parseDoctorColorData, base_url, getCsrfToken, getMinutes};
