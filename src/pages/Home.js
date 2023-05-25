import { Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Dashboard from "../pages/Dashboard.js";
import Header from "../components/Header.js";
import SideNav from "../components/SideNav.js";
import Doctors from "./Doctors.js";
import PatientDetails from "./PatientDetails.js";
import Settings from "./Settings.js";
import AddPatient from "./AddPatient.js";
import AddDoctor from "./AddDoctor.js";
import AddAdmin from "./AddAdmin.js";
import Patients from "./Patients.js";
import { users } from "../../src/adminAPI";
import ReserveDetails from "./ReserveDetails.js";
import DoctorDetails from "./doctorDetails.js";
import Notes from "./Notes.js";
import AddReserve from "./AddReserve.js";
import Categories from "../components/Categories.js";
import Calendar from "./Calender.js";
import General from "./General.js";
import CardView from "../components/CardView.js";
import Rooms from "./Rooms.js";
import AddRoom from "./AddRoom.js";
import RoomDetails from "./RoomDetails.js";

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
          <Route exact path="/patients" element={<Patients />} />
          <Route exact path="/doctors" element={<Doctors />} />
          <Route exact path="/patientDetails" element={<PatientDetails />} />
          <Route exact path="/notes" element={<Notes />} />
          <Route exact path="/doctorDetails" element={<DoctorDetails />} />
          <Route exact path="/rooms" element={<Rooms/>} />
          <Route exact path="/addRoom" element={<AddRoom/>} />
          <Route exact path="/roomDetails" element={<RoomDetails/>} />
          <Route
            exact
            path="/reservations"
            element={<Calendar type={"res"} />}
          />
          <Route exact path="/reserveDetails" element={<ReserveDetails />} />
          <Route exact path="/general" element={<General />} />
          <Route exact path="/categories" element={<Categories />} />
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
          <Route exact path="/addPatient" element={<AddPatient />} />
          <Route exact path="/addDoctor" element={<AddDoctor />} />
          <Route exact path="/addReserve" element={<AddReserve />} />
          {userDet.email == "admin@hospi.com" ? (
            <Route exact path="/addAdmin" element={<AddAdmin />} />
          ) : (
            ""
          )}
        </Routes>
      </main>
    </React.Fragment>
  );
};

export default Home;
