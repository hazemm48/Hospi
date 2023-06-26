import React from "react";
import warning from "../images/warning.jpg";


const WarningCard = ({ text }) => {
  return (
    <div className="card container label-yellow">
      <div className="card-body">
        <div className="row">
          <div style={{ maxWidth: "35%" }} class="col-md-1">
            <img className="patHomeImg" src={warning} />
          </div>
          <div className="col-md-10 welcome-text-wrapper align-self-center">
            <p>{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningCard;
