const initialFormState = {
    popupVisible: false,
    popupTitle: "customer",
    editData: {
        "description": "",
        "startDate": new Date(),
        'endDate': new Date(),
        "doctorId": 0,
        "patientId": 0,
        "confirmation_status": "pending_not_sent",
        "completed": false,
        "price": 0,

    },
};

const initialCreatePatientFormState = {
    popupVisible: false,
    popupTitle: "Adauga pacient",
    editData: {
        "last_name": "",
        "first_name": "",
        "phone_number": "",
        'birth_date': new Date(),
    }
};

const initialConfirmPopupState = {
    popupVisible: false,
}

export { initialFormState, initialCreatePatientFormState, initialConfirmPopupState };