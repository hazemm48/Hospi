import moment from "moment-timezone";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { removeFile, uploadFile } from "../adminAPI.js";

const FeedBack = (props) => {
console.log(props);
  return (
      <div className="feed-back"  onClick={()=>{props.setDisplay(false)}} >
        <div className="wrapper">
          <div className="content">
            <span>{props.data}</span>
          </div>
        </div>
      </div>
  );
};

export default FeedBack;
