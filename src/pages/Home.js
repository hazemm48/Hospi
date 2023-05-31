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

const Home = () => {
  const [userDet, setUser] = useState({
    name: "",
    id: "",
    email: "",
  });
  let navigate = useNavigate();

  const GetDetails = async () => {
    let body = {};
    let res = await users(body);
    let user = res.users;
    setUser({
      name: user.name,
      email: user.email,
      id: user._id,
    });
    console.log(user);
  };

  useEffect(() => {
    if (!localStorage.token) {
      navigate("/");
    } else {
      GetDetails();
    }
  }, []);

  return (
    <React.Fragment>
      <Header name={userDet.name} email={userDet.email} id={userDet.id} />
      <main>
        <SideNav />
        <Routes>
          <Route
            exact
            path="/dashboard"
            element={<Dashboard name={userDet.name} email={userDet.email} />}
          />
          <Route exact path="/addPatient" element={<AddPatient />} />
          <Route exact path="/patients" element={<Patients />} />
          <Route exact path="/patientDetails" element={<PatientDetails />} />
          <Route exact path="/addDoctor" element={<AddDoctor />} />
          <Route exact path="/doctors" element={<Doctors />} />
          <Route exact path="/doctorDetails" element={<DoctorDetails />} />
          <Route exact path="/addRoom" element={<AddRoom />} />
          <Route exact path="/rooms" element={<Rooms />} />
          <Route exact path="/roomDetails" element={<RoomDetails />} />
          <Route exact path="/addMedicalRecord" element={<AddMedicRecord />} />
          <Route exact path="/medicalRecord" element={<MedicalRecord />} />
          <Route
            exact
            path="/medicalRecordDetails"
            element={<MedicRecordDetails />}
          />
          <Route exact path="/addReserve" element={<AddReserve />} />
          <Route
            exact
            path="/reservations"
            element={<Calendar type={"res"} />}
          />
          <Route exact path="/reserveDetails" element={<ReserveDetails />} />
          <Route exact path="/addFirstAid" element={<AddFirstAid />} />
          <Route exact path="/firstAid" element={<FirstAid />} />
          <Route exact path="/firstAidDetails" element={<FirstAidDetails />} />
          <Route exact path="/laboratory" element={<Lab />} />
          <Route exact path="/radiation" element={<Rad />} />
          <Route exact path="/notes" element={<Notes />} />
          <Route exact path="/general" element={<General />} />
          <Route exact path="/categories" element={<Categories />} />
          <Route exact path="/test" element={<Test />} />
          <Route exact path="/symptomChecker" element={<SymptomChecker />} />
          <Route
            exact
            path="/settings"
            element={
              <Settings
                name={userDet.name}
                email={userDet.email}
                id={userDet.id}
              />
            }
          />

          {userDet.email == "admin@hospi.com" && (
            <Route exact path="/addAdmin" element={<AddAdmin />} />
          )}
        </Routes>
      </main>
    </React.Fragment>
  );
};

export default Home;
