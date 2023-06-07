import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  let navigate = useNavigate();
  let { pathname } = useLocation();

  if (pathname.includes("home")) {
    window.location.replace("/");
    localStorage.removeItem("token");
  }
  return (
    <div className="main-content">
      <div className="container-fluid">
        <h1>Page Not Found</h1>
      </div>
    </div>
  );
};

export default NotFoundPage;
