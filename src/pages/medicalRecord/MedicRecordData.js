export const medicList = (type) => {
  let list = {
    diagnose: [
      ["textarea", "diagone description", "name"],
      ["input", "diagnose date", "date", "date"],
      ["select", "is it chronic", "chronic"],
      ["select", "is still active", "still"],
      ["input", "illness end date", "endDate", "date"],
      ["input", "diagnostician name", "doctorName", "text"],
    ],
    medication: [
      ["input", "medication name", "name", "text"],
      ["input", "medication start date", "date", "date"],
      ["select", "still taking", "still"],
      ["input", "medication end date", "endDate", "date"],
      ["textarea", "dosage", "dosage"],
      ["input", "doctor who prescribed it", "doctorName", "text"],
    ],
    rad: [
      ["input", "radiation name", "name", "text"],
      ["input", "radiation result date", "date", "date"],
      ["input", "radiology center name", "doctorName", "text"],
    ],
    lab: [
      ["input", "lab invsetigation name", "name", "text"],
      ["input", "lab result date", "date", "date"],
      ["input", "lab center name", "doctorName", "text"],
    ],
    operation: [
      ["input", "operation name", "name", "text"],
      ["input", "operation date", "date", "date"],
      ["input", "surgeaon name", "doctorName", "text"],
    ],
  };

  let data = {};

  let arr = [
    ["diagnose", "diagnose"],
    ["medication", "medication_details"],
    ["rad", "radiation_result"],
    ["lab", "lab_result"],
    ["operation", "operation"],
  ];
  arr.some((e) => {
    if (e.includes(type)) {
      data["value"] = e[0];
      data["data"] = list[e[0]];
    }
  });
  console.log(data);
  return data;
};
