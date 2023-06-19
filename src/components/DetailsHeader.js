import React, { useState } from "react";
import { Link } from "react-router-dom";

const DetailsHeader = ({ name, type, updateUserDetails, role,superAdmin }) => {

  const editDetails = () => {
    let userDet = Array.from(
      document
        .querySelector("#userDet")
        .querySelectorAll("input,textArea,select")
    );
    let elements = "";
    if (type == "doctor") {
      let schDet = Array.from(
        document.querySelector("#schDet").querySelectorAll("input,select")
      );
      elements = userDet.concat(schDet);
    } else {
      elements = userDet;
    }
    let x = false;
    elements.forEach((e, i) => {
      if (!["sta", "reg"].includes(e.name)) {
        if (e.hasAttribute("disabled")) {
          e.removeAttribute("disabled");
          if (type == "doctor") {
            document.querySelectorAll("#delSchBtn").forEach((e) => {
              e.removeAttribute("hidden");
            });
            document.querySelector("#schBtn").removeAttribute("hidden");
          }
          document.getElementById("editDetails").innerHTML = "submit";
          return (x = false);
        } else {
          return (x = true);
        }
      }
    });
    x && updateUserDetails();
  };

  return (
    <div className="section row title-section">
      <div className="col-md-8">
        <div aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={`/${role}/${type}s`}>
                <a>{type}</a>
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {name}
            </li>
          </ol>
        </div>
      </div>
      {superAdmin && (
        <div className="col-md-4">
          <button
            id="editDetails"
            className="btn btn-dark-red-f-gr"
            onClick={() => {
              editDetails();
            }}
          >
            <i className="las la-edit" />
            {`edit ${type}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailsHeader;
