import moment from "moment";

export const resDetList = (type, data, role) => {
  let list = [
    ["patient name", "patName", data.patName],
    ["fees", "fees", data.fees],
    ["date", "date", moment(data.date).format("DD/MM/YYYY")],
    ["phone", "phone", data.phone && data.phone],
    ["another person", "anotherPerson", data.anotherPerson ? "yes" : "no"],
  ];

  if (type == "doctor") {
    list.splice(
      1,
      0,
      ["doctor name", "docName", data.docName],
      ["speciality", "speciality", data.speciality]
    );
    list.splice(
      5,
      0,
      ["time", "time", data.time.from + " - " + data.time.to],
      ["visit type", "visitType", data.visitType],
      ["turn number", "turnNum", data.turnNum]
    );
  } else if (type == "lab"){
    list.splice(1, 0, ["analysis name", "productName", data.productName]);
  }
  else if (type == "rad"){
    list.splice(1, 0, ["scan name", "productName", data.productName]);
  }

  if (role == "admin") {
    let mom = (date) => {
      return moment(date).format("DD/MM/YYYY h:mm A");
    };
    type == "doctor" && list.push(["doctor id", "doctorId", data.doctorId]);
    list.push(
      ["patient id", "patientId", data.patientId && data.patientId],
      ["created at", "createdAt", mom(data.createdAt)]
    );
    mom(data.createdAt) != mom(data.updatedAt) &&
      list.push(["updated at", "updatedAt", mom(data.updatedAt)]);
  }

  return list;
};
