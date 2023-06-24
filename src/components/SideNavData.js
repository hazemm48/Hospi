let sideNavData= (role)=>{
let data = {
  patient:[
  ["/patient/home","la-shapes","Home"],
  ["/patient/doctors","la-stethoscope","Doctors"],
  ["/patient/reservations","la-calendar-check","Reservations"],
  ["/patient/reserve/rad","la-x-ray","Radiations"],
  ["/patient/reserve/lab","la-vials","Laboratory"],
  ["/patient/medicalRecord","la-notes-medical","Medical Records"],
  ["/patient/drugsInteraction","la-capsules","Drugs Interaction"],
  ["/patient/drugsSearch","la-capsules","Drugs Search"],
  ["/patient/symptomChecker","la-heartbeat","Symptom checker"],
  ["/patient/firstAid","la-medkit","First Aid"],
  ["/patient/settings","la-cogs","Settings"],
],
doctor:[
  ["/doctor/home","la-shapes","Dashboard"],
  ["/doctor/patients","la-user-injured","Patients"],
  ["/doctor/reservations","la-calendar-check","Schedule"],
  ["/doctor/doctorNotes","la-clipboard","Notes"],
  ["/doctor/drugsInteraction","la-capsules","Drugs Interaction"],
  ["/doctor/drugsSearch","la-capsules","Drugs Search"],
  ["/doctor/settings","la-cogs","Settings"]
],
superAdmin:[
  ["/admin/dashboard","la-shapes","Dashboard"],
  ["/admin/patients","la-user-injured","Patients"],
  ["/admin/doctors","la-stethoscope","Doctors"],
  ["/admin/admins","la-user-shield","Admins"],
  ["/admin/reservations","la-calendar-check","Reservations"],
  ["/admin/radiation","la-x-ray","Radiations"],
  ["/admin/laboratory","la-vials","Laboratory"],
  ["/admin/general","la-globe","General"],
  ["/admin/settings","la-cogs","Settings"],
],
admin:[
  ["/admin/dashboard","la-shapes","Dashboard"],
  ["/admin/patients","la-user-injured","Patients"],
  ["/admin/doctors","la-stethoscope","Doctors"],
  ["/admin/reservations","la-calendar-check","Reservations"],
  ["/admin/reserve/rad","la-x-ray","Radiations"],
  ["/admin/reserve/lab","la-vials","Laboratory"],
  ["/admin/settings","la-cogs","Settings"],
]
}

return data[role]
}

export default sideNavData