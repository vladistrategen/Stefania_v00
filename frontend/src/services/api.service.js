const API_BASE_URL = "/api";

const fetchAppointments = async () => {
    const response = await fetch(API_BASE_URL + "/appointments");
    const data = await response.json();
    return data;
}

const fetchDoctors = async () => {
    const response = await fetch(API_BASE_URL + "/doctors");
    const data = await response.json();
    return data;
}

const fetchPatients = async () => {
    const response = await fetch(API_BASE_URL + "/patients");
    const data = await response.json();
    return data;
}

const fetchAppointmentById = async (id) => {
    const response = await fetch(API_BASE_URL + "/appointments/" + id);
    const data = await response.json();
    return data;
}

const fetchDoctorById = async (id) => {
    const response = await fetch(API_BASE_URL + "/doctors/" + id);
    const data = await response.json();
    return data;
}

const fetchPatientById = async (id) => {
    const response = await fetch(API_BASE_URL + "/patients/" + id);
    const data = await response.json();
    return data;
}

export {
    fetchAppointments,
    fetchDoctors,
    fetchPatients,
    fetchAppointmentById,
    fetchDoctorById,
    fetchPatientById
}