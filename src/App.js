import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import React from "react";
import PatientHome from "./patientPages/PatientHome.js";
import DoctorHome from "./doctorPages/doctorHome.js";


const App = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/admin/*" element={<Home />} />
      <Route path="/patient/*" element={<PatientHome />} />
      <Route path="/doctor/*" element={<DoctorHome />} />
    </Routes>
  );
};

export default App;

/* import React from "react";

class Header extends React.Component {
  render() {
    return (

    );
  }
}

export default Header; */
