const doctorDisplayExpr = (item) => {
    if(item!=null){
        return "Dr. " + item.last_name + " " + item.first_name;
    }
}

const patientDisplayExpr = (item) => {
    if(item != null){
        return item.last_name + " " + item.first_name +' - ' + item.birth_date;
    }
}

export {doctorDisplayExpr, patientDisplayExpr};