import React, { useState } from "react";

const Alert = (props) => {
  let { alertData } = props;
  /*
  alert variables : 
  {
    primary,secondary,success,danger,warning,info,light,dark
  }
  */

  return (
    <>
      {setTimeout(() => {
        <div
          class={`alert alert-${alertData.type}`}
          id="alert"
          role="alert"
          style={{ visibility: "visible" }}
        >
          {alertData.text}
        </div>;
      }, 5000)}
    </>
  );
};

export default Alert;
