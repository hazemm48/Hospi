import React from "react";

let LoadingSpinner = () => {
  return (
    <div className="main-content" style={{ alignContent: "center" }}>
      <div className="spinner-container">
        <div className="loading-spinner">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
