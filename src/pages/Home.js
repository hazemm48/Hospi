import { Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Dashboard from "../pages/Dashboard.js";
import Header from "../components/Header.js";
import SideNav from "../components/SideNav.js";
import Doctors from "./doctors/Doctors.js";
import PatientDetails from "./patients/PatientDetails.js";
import Settings from "./Settings.js";
import AddPatient from "./patients/AddPatient.js";
import AddDoctor from "./doctors/AddDoctor.js";
import AddAdmin from "./AddAdmin.js";
import Patients from "./patients/Patients.js";
import { users } from "../../src/adminAPI";
import ReserveDetails from "./reserves/ReserveDetails.js";
import DoctorDetails from "./doctors/doctorDetails.js";
import Notes from "./Notes.js";
import AddReserve from "./reserves/AddReserve.js";
import Categories from "../components/Categories.js";
import Calendar from "./Calender.js";
import General from "./General.js";
import Rooms from "./rooms/Rooms.js";
import AddRoom from "./rooms/AddRoom.js";
import RoomDetails from "./rooms/RoomDetails.js";
import AddMedicRecord from "./medicalRecord/AddMedicRecord.js";
import MedicalRecord from "./medicalRecord/MedicalRecord.js";
import MedicRecordDetails from "./medicalRecord/MedicalRecordDetails.js";
import AddFirstAid from "./firstAid/AddFirstAid.js";
import FirstAidDetails from "./firstAid/FirstAidDetails.js";
import FirstAid from "./firstAid/FirstAid.js";
import Rad from "./radiation/Rad.js";
import Lab from "./laboratory/Lab.js";
import Test from "./test.js";
import SymptomChecker from "./symptomChecker/SymptomChecker.js";
import LoadingSpinner from "../components/Loading.js";

const Home = () => {
  const [userDet, setUser] = useState();
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const GetDetails = async () => {
    let body = {};
    let res = await users(body);

    let user = res.users;
    console.log(user);
    if (user.role == "admin") {
      setUser(user);
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
              <SideNav role={"admin"} />
              <Routes>
                <Route
                  exact
                  path="/dashboard"
                  element={<Dashboard user={userDet} />}
                />
                <Route exact path="/addPatient" element={<AddPatient />} />
                <Route
                  exact
                  path="/patients"
                  element={<Patients role={userDet.role} />}
                />
                <Route
                  exact
                  path="/patientDetails"
                  element={<PatientDetails role={userDet.role} />}
                />
                <Route
                  exact
                  path="/doctors"
                  element={<Doctors role={userDet.role} />}
                />
                <Route
                  exact
                  path="/doctorDetails"
                  element={<DoctorDetails role={userDet.role} />}
                />
                <Route exact path="/rooms" element={<Rooms />} />
                <Route exact path="/roomDetails" element={<RoomDetails />} />
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
                  element={<Calendar type={"res"} role={userDet.role} />}
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
                <Route exact path="/notes" element={<Notes />} />
                <Route exact path="/general" element={<General />} />
                <Route exact path="/categories" element={<Categories />} />
                {/* <Route exact path="/test" element={<Test />} /> */}
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

                {userDet.email == "admin@hospi.com" && (
                  <>
                    <Route
                      exact
                      path="/addFirstAid"
                      element={<AddFirstAid />}
                    />
                    <Route exact path="/addRoom" element={<AddRoom />} />
                    <Route exact path="/addDoctor" element={<AddDoctor />} />
                    <Route exact path="/addAdmin" element={<AddAdmin />} />
                  </>
                )}
              </Routes>
            </main>
          </>
        )
      )}
    </>
  );
};

export default Home;
