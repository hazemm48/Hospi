import moment from "moment-timezone";
import React from "react";
import { Link } from "react-router-dom";

const NotesCard = (props) => {
  return (
    <div className="card notes-card">
      <div className="card-header">
        <h5>
          notes
          <Link
            to="/home/notes"
            state={props.id}
            className="btn btn-dark-red-f btn-sm float-right"
          >
            see all
          </Link>
        </h5>
      </div>
      <div className="card-body">
        <textarea
          className="form-control"
          placeholder="you can write patient notes over here"
          rows={16}
          defaultValue={""}
        />
        <button className="btn btn-dark-red-f float-right btn-sm">
          <i className="las la-save" />
          save note
        </button>
      </div>
      <div className="card-footer">
        <div className="float-right">
          <p>{moment().format("DD, MMM, YYYY")}</p>
        </div>
      </div>
    </div>
  );
};

export default NotesCard;
