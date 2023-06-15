import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { medicalRecord } from "../../adminAPI.js";
import FilesCard from "../../components/FilesCard.js";
import LoadingSpinner from "../../components/Loading.js";
import InputsHandler from "../../components/InputsHandler.js";
import { medicList } from "./MedicRecordData.js";

const MedicRecordDetails = ({ role }) => {
  const [loading, setLoading] = useState(true);
  const [htmlData, setHtmlData] = useState();
  const [data, setData] = useState();

  const { state } = useLocation();

  let createHtmlData = (type) => {
    let data = medicList(type);
    role == "admin" &&
      data.data.push(
        ["input", "patient id", "patientId", "text"],
        ["input", "created at", "createdAt", "date"]
      );
    setHtmlData(data);
  };

  const navigate = useNavigate();

  let getRecordsData = async () => {
    console.log(state);
    let body = {
      filter: {
        _id: state,
      },
    };
    let { records } = await medicalRecord(body, "POST", "get");
    setData(records[0]);
    createHtmlData(records[0].type);
    console.log(records);
    setLoading(false);
  };

  useEffect(() => {
    getRecordsData();
    setLoading(true);
  }, []);

  const editRecord = () => {
    let elements = document.forms.form.querySelectorAll(
      "input,select,textarea"
    );
    console.log(elements);
    let x = false;
    elements.forEach((e, i) => {
      if (e.hasAttribute("disabled")) {
        if (!["patientId", "createdAt"].includes(e.name)) {
          e.removeAttribute("disabled");
          document.getElementById("editPat").innerHTML = "submit";
          return (x = false);
        }
      } else {
        return (x = true);
      }
    });
    x && updateRecord();
  };

  const recordDelete = async () => {
    if (window.confirm("Are you sure you want to delete this medical record")) {
      let body = {
        id: state,
      };
      let deleted = await medicalRecord(body, "DELETE");
      alert(deleted.message);
      if (deleted.message == "deleted") {
        navigate(-1);
      }
    }
  };

  const updateRecord = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let obj = {};
    for (const pair of formData.entries()) {
      console.log(pair[0]);
      if (!["patientId", "createdAt"].includes(pair[0])) {
        obj[pair[0]] = pair[1];
      }
    }

    let body = {
      id: state,
      data: obj,
    };
    console.log(body);
    let update = await medicalRecord(body, "PUT");
    console.log(update);
    alert(update.message);
    if (update.message == "updated") {
      window.location.reload();
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="main-content">
          {data && (
            <div className="container-fluid">
              <div className="section row title-section">
                <div className="col-md-8">
                  <div aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to={`/${role}/medicalRecord`} state={data.patientId}>
                          <a>medical records</a>
                        </Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        {data._id}
                      </li>
                    </ol>
                  </div>
                </div>
                {role != "doctor" && (
                  <div className="col-md-4">
                    <button
                      id="editPat"
                      className="btn btn-dark-red-f-gr"
                      onClick={() => {
                        editRecord();
                      }}
                    >
                      <i className="las la-edit" />
                      edit record
                    </button>
                  </div>
                )}
              </div>
              <div className="section patient-details-section">
                <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="card container">
                          <div className="card-body">
                            <form id="form">
                              <InputsHandler
                                handler={htmlData.data}
                                data={data}
                                disable={true}
                              />
                            </form>
                          </div>
                        </div>
                      </div>
                      {role != "doctor" && (
                        <div className="col-sm-12">
                          <div className="card">
                            <button
                              className="btn btn-red-f-gr"
                              onClick={() => {
                                recordDelete();
                              }}
                            >
                              <i className="las la-trash" />
                              delete medical record
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <FilesCard
                      role={role}
                      files={data.files}
                      fieldName={"medicRecord"}
                      id={data.patientId}
                      recId={state}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MedicRecordDetails;
