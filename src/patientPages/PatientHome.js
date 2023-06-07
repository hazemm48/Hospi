import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "../components/Header.js";
import SideNav from "../components/SideNav.js";
import Doctors from "../pages/doctors/Doctors.js";
import Settings from "../pages/Settings.js";
import { users } from "../adminAPI";
import ReserveDetails from "../pages/reserves/ReserveDetails.js";
import AddReserve from "../pages/reserves/AddReserve.js";
import Calendar from "../pages/Calender.js";
import AddMedicRecord from "../pages/medicalRecord/AddMedicRecord.js";
import MedicalRecord from "../pages/medicalRecord/MedicalRecord.js";
import MedicRecordDetails from "../pages/medicalRecord/MedicalRecordDetails.js";
import FirstAidDetails from "../pages/firstAid/FirstAidDetails.js";
import FirstAid from "../pages/firstAid/FirstAid.js";
import Rad from "../pages/radiation/Rad.js";
import Lab from "../pages/laboratory/Lab.js";
import SymptomChecker from "../pages/symptomChecker/SymptomChecker.js";
import LoadingSpinner from "../components/Loading.js";
import HomePage from "./HomePage.js";

const PatientHome = () => {
  const [userDet, setUserDet] = useState();
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const GetDetails = async () => {
    let body = {};
    let res = await users(body);

    let user = res.users;
    console.log(user);
    if (user.role == "patient") {
      setUserDet(user);
    } else {
      navigate("/notAuthorized");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoading(true);
      GetDetails();
    } else {
      navigate("/");
    }
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        userDet && (
          <>
            <Header user={userDet} />
            <main>
              <SideNav role={"patient"} />
              <Routes>
                <Route
                  exact
                  path="/home"
                  element={<HomePage user={userDet} />}
                />
                <Route
                  path="doctors"
                  element={
                    <Doctors
                      role={userDet.role}
                      id={userDet._id}
                      favDocs={userDet.patientInfo.favDoctors}
                    />
                  }
                />
                <Route
                  exact
                  path="/addMedicalRecord"
                  element={<AddMedicRecord />}
                />
                <Route
                  exact
                  path="/medicalRecord"
                  element={<MedicalRecord role={userDet.role} />}
                />
                <Route
                  exact
                  path="/medicalRecordDetails"
                  element={<MedicRecordDetails role={userDet.role} />}
                />
                <Route
                  exact
                  path="/addReserve"
                  element={<AddReserve role={userDet.role} />}
                />
                <Route
                  exact
                  path="/reservations"
                  element={
                    <Calendar
                      filter={{ patientId: userDet._id }}
                      role={userDet.role}
                    />
                  }
                />
                <Route
                  exact
                  path="/reserveDetails"
                  element={<ReserveDetails role={userDet.role} />}
                />
                <Route
                  exact
                  path="/firstAid"
                  element={<FirstAid role={userDet.role} />}
                />
                <Route
                  exact
                  path="/firstAidDetails"
                  element={<FirstAidDetails role={userDet.role} />}
                />
                <Route
                  exact
                  path="/laboratory"
                  element={<Lab role={userDet.role} />}
                />
                <Route
                  exact
                  path="/radiation"
                  element={<Rad role={userDet.role} />}
                />
                <Route
                  exact
                  path="/symptomChecker"
                  element={<SymptomChecker />}
                />
                <Route
                  exact
                  path="/settings"
                  element={<Settings user={userDet} role={userDet.role} />}
                />
                <Route path="*" element={<Navigate to="/notFound" replace />} />
              </Routes>
            </main>
          </>
        )
      )}
    </>
  );
};

export default PatientHome;
