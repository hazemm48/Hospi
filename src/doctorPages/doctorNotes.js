import React from "react";
import NotesCard from "../components/NotesCard.js";

const DoctorNotes = ({ role,id }) => {


  return (
    <div className="main-content">
      <div className="container-fluid">
          <div className="section patient-details-section">
                <NotesCard id={id} role={role} personal={true} />
          </div>
      </div>
    </div>
  );
};

export default DoctorNotes;
