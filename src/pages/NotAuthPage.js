import React, { useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../images/hospi.png";

const NotAuthPage = () => {
  let { state } = useLocation();

  if (state?.includes("home")) {
    localStorage.removeItem("token");
  }
  useLayoutEffect(()=>{
    document.querySelector("body").style.background = "#1C2127";
  },[])

  return (
    <div classname="main-content">
      <div classname="container-fluid">
        <div className="message">You are not authorized.</div>
        <div className="message2">
          You tried to access a page you did not have prior authorization for.
        </div>
        <div className="notAuth">
          <div className="neon">403</div>
          <div className="door-frame">
            <div className="door">
              <div className="rectangle" />
              <div className="handle" />
              <div className="window">
                <div className="eye" />
                <div className="eye eye2" />
                <div className="leaf" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotAuthPage;
