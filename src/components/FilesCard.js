import moment from "moment-timezone";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { removeFile, uploadFile } from "../adminAPI.js";

const FilesCard = (props) => {
  const [files, setFiles] = useState(props.files);

  const upload = async (e) => {
    console.log(e.target.files);
    let formData = new FormData();
    formData.append("id", props.id);
    formData.append("fieldName", "users");
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append(`files`, e.target.files[i]);
    }
    let uploaded = await uploadFile(formData, "uploadFiles");
    console.log(uploaded);
    uploaded.message == "done" && setFiles(uploaded.files);
  };

  const deleteFiles = async (e) => {
    console.log(e);
    console.log(props.id);
    let body = {
      id: props.id,
      path: e,
    };
    console.log(body);
    let deleted = await removeFile(body, "removeFiles");
    console.log(deleted);
    deleted.message == "file deleted" && setFiles(deleted.files);
  };

  return (
    <div className="card files-card">
      <div className="card-header">
        <h5>
          files
          <input
            type="file"
            accept="image/*,application/pdf"
            multiple
            id="fileupload"
            style={{ display: "none" }}
            onChange={(e) => {
              upload(e);
            }}
          />
          <button
            className="btn btn-dark-red-f btn-sm"
            onClick={() => {
              document.getElementById("fileupload").click();
            }}
          >
            <i className="las la-file-medical" />
            add file
          </button>
        </h5>
      </div>
      <div className="card-body">
        <div className="list-group list-group-flush">
          {files?.map((e) => {
            return (
              <div className="list-group-item">
                <i className="las la-file-alt" />
                <a href={e.path} target="_blank">
                  {e.name}
                </a>
                <div className="float-right">
                  <div className="action-buttons no-display">
                    <button
                      className="btn btn-sm btn-dark-red-f"
                      data-id={e.path}
                      onClick={() => {
                        deleteFiles(e.path);
                      }}
                    >
                      <i className="las la-trash" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilesCard;
