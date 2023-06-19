import React, { useState } from "react";
import { removeFile, uploadFile } from "../adminAPI.js";
import LoadingSpinner from "./Loading.js";

const FilesCard = (props) => {
  const [files, setFiles] = useState(props.files);
  const [loading, setLoading] = useState(false);

  const upload = async (e) => {
    console.log(e.target.files);
    let formData = new FormData();
    if (props.fieldName == "medicRecord") {
      formData.append("recId", props.recId);
    } else if (props.fieldName == "reserves") {
      formData.append("type", props.type);
    }
    formData.append("id", props.id);
    formData.append("fieldName", props.fieldName);
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append(`files`, e.target.files[i]);
    }
    let uploaded = await uploadFile(formData, "uploadFiles");
    console.log(uploaded);
    if (uploaded.message == "done") {
      setFiles(uploaded.files);
    }
  };

  const deleteFiles = async (e) => {
    console.log(e);
    console.log(props.id);
    let body = {
      id: props.id,
      path: e,
      fieldName: props.fieldName,
    };
    if (props.fieldName == "medicRecord") {
      body.id = props.recId;
    }
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
          {(props.role == "admin" ||
            (props.role == "doctor" && props.fieldName == "reserves")) && (
            <>
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
            </>
          )}
        </h5>
      </div>

      <div className="card-body">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="list-group list-group-flush">
            {files?.map((e) => {
              return (
                <div className="list-group-item">
                  <i className="las la-file-alt" />
                  <a href={e.path} target="_blank">
                    {e.name}
                  </a>
                  {(props.role == "admin" ||
                    (props.role == "doctor" &&
                      props.fieldName == "reserves")) && (
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
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesCard;
