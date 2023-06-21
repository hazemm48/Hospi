import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import React from "react";
import PatientHome from "./patientPages/PatientHome.js";
import DoctorHome from "./doctorPages/doctorHome.js";
import LoginTest from "./pages/test.js";
import NotFoundPage from "./pages/NotFoundPage.js";
import NotAuthPage from "./pages/NotAuthPage.js";

const App = () => {
  let {pathname}= useLocation()
  console.log(pathname);
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/admin/*" element={<Home />} />
      <Route path="/patient/*" element={<PatientHome />} />
      <Route path="/doctor/*" element={<DoctorHome />} />
      {/* <Route path="/test/*" element={<LoginTest />} /> */}
      <Route path="/notFound" element={<NotFoundPage />} />
      <Route path="/notAuthorized" element={<NotAuthPage />} />
      <Route path="*" element={<Navigate to="/notFound" state={pathname} replace />} />
    </Routes>
  );
};

export default App;
