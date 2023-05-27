export const medicList = (type) => {
  let list = {
    diagonse: {
      value: "daignose",
      data: [
        ["textarea", "diagone description", "name"],
        ["input", "diagnose date", "date", "date"],
        ["select", "is it chronic", "chronic"],
        ["select", "is still active", "still"],
        ["input", "illness end date", "endDate", "date"],
        ["input", "diagnostician name", "doctorName", "text"],
      ],
    },
    medication_details: {
      value: "medication",
      data: [
        ["input", "medication name", "name", "text"],
        ["input", "medication start date", "date", "date"],
        ["select", "still taking", "still"],
        ["input", "medication end date", "endDate", "date"],
        ["textarea", "dosage", "dosage"],
        ["input", "doctor who prescribed it", "doctorName", "text"],
      ],
    },
    radiation_result: {
      value: "rad",
      data: [
        ["input", "radiation name", "name", "text"],
        ["input", "radiation result date", "date", "date"],
        ["input", "radiology center name", "doctorName", "text"],
      ],
    },
    lab_result: {
      value: "lab",
      data: [
        ["input", "lab invsetigation name", "name", "text"],
        ["input", "lab result date", "date", "date"],
        ["input", "lab center name", "doctorName", "text"],
      ],
    },
    operation: {
      value: "operation",
      data: [
        ["input", "operation name", "name", "text"],
        ["input", "operation date", "date", "date"],
        ["input", "surgeaon name", "doctorName", "text"],
      ],
    },
  };

  return list[type];
};
