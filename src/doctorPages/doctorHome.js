import { Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Dashboard from "../pages/Dashboard.js";
import Header from "../components/Header.js";
import SideNav from "../components/SideNav.js";
import PatientDetails from "../pages/patients/PatientDetails.js";
import Settings from "../pages/Settings.js";
import Patients from "../pages/patients/Patients.js";
import { users } from "../../src/adminAPI";
import ReserveDetails from "../pages/reserves/ReserveDetails.js";
import Notes from "../pages/Notes.js";
import Categories from "../components/Categories.js";
import Calendar from "../pages/Calender.js";
import MedicalRecord from "../pages/medicalRecord/MedicalRecord.js";
import MedicRecordDetails from "../pages/medicalRecord/MedicalRecordDetails.js";
import LoadingSpinner from "../components/Loading.js";

const DoctorHome = () => {
  const [userDet, setUserDet] = useState();
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const GetDetails = async () => {
    let body = {};
    let res = await users(body);

    let user = res.users;
    console.log(user);
    if (user.role == "doctor") {
      setUserDet(user);
    } else {
      alert("not authorized");
      navigate(-1);
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
              <SideNav role={"doctor"} />
              <Routes>
                <Route
                  exact
                  path="/dashboard"
                  element={
                    <Dashboard name={userDet.name} email={userDet.email} role={userDet.role}/>
                  }
                />
                <Route exact path="/patients" element={<Patients role={userDet.role} />} />
                <Route
                  exact
                  path="/patientDetails"
                  element={<PatientDetails role={userDet.role} />}
                />
                <Route
                  exact
                  path="/medicalRecord"
                  element={<MedicalRecord role={userDet.role} />}
                />
                <Route
                  exact
                  path="/medicalRecordDetails"
                  element={<MedicRecordDetails role={userDet.role}/>}
                />
                <Route
                  exact
                  path="/reservations"
                  element={<Calendar type={"res"} role={userDet.role} />}
                />
                <Route
                  exact
                  path="/reserveDetails"
                  element={<ReserveDetails role={userDet.role} />}
                />
                <Route exact path="/notes" element={<Notes />} role={userDet.role} />
                <Route exact path="/categories" element={<Categories />} role={userDet.role} />
                <Route
                  exact
                  path="/settings"
                  element={
                    <Settings
                      name={userDet.name}
                      email={userDet.email}
                      id={userDet.id}
                      role={userDet.role}
                    />
                  }
                />
              </Routes>
            </main>
          </>
        )
      )}
    </>
  );
};

export default DoctorHome;
