import moment from "moment-timezone";
import React from "react";
import { Link } from "react-router-dom";

const FilesCard = (props) => {
  return (
    <div className="card files-card">
      <div className="card-header">
        <h5>
          files
          <button className="btn btn-dark-red-f btn-sm">
            <i className="las la-file-medical" />
            add file
          </button>
        </h5>
      </div>
      <div className="card-body">
        <div className="list-group list-group-flush">
          <a className="list-group-item">
            <i className="las la-file-excel" />
            check up results.csv
            <div className="float-right">
              <small className="text-muted">123kb</small>
              <div className="action-buttons no-display">
                <button className="btn btn-sm btn-dark-red-f">
                  <i className="las la-trash" />
                </button>
                <button className="btn btn-sm btn-dark-red-f">
                  <i className="las la-download" />
                </button>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FilesCard;
