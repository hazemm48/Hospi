import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../components/Loading.js";
import { useLocation, useNavigate } from "react-router-dom";
import Categories from "../../components/Categories.js";
import { medicList } from "./MedicRecordData.js";
import { medicalRecord, uploadFile } from "../../adminAPI.js";

const AddMedicRecord = () => {
  const [htmlData, setHtmlData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageView, setPageView] = useState(false);
  const [type, setType] = useState();
  let { state } = useLocation();
  let navigate = useNavigate();

  let createHtmlData = () => {
    setHtmlData(medicList(type));
  };

  useEffect(() => {
    if (pageView) {
      createHtmlData();
    }
  }, [pageView]);

  const viewStill = (e) => {
    let still = document.querySelector("#still");
    if (e.target.value == "true") {
      still.style.display = "none";
      viewEndDate(e);
    } else if (e.target.value == "false") {
      still.style.display = "block";
      viewEndDate(e);
    }
  };

  const viewEndDate = (e) => {
    let endDate = document.querySelector("#endDate");
    if (e.target.value == "false") {
      endDate.style.display = "block";
    } else if (e.target.value == "true") {
      endDate.style.display = "none";
    }
  };

  const data = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);

    let body = {
      file: [],
    };
    for (const pair of formData.entries()) {
      console.log(pair[0]);
      if (pair[0] == "file") {
        body["file"].push(pair[1]);
      } else {
        body[pair[0]] = pair[1];
      }
    }
    console.log(body);
    body.patientId = state;
    let files = body.file;
    delete body.file;

    let add = await medicalRecord(body);
    console.log(add);
    alert(add.message);
    if (add.message == "added") {
      if (addFiles(files, add.added[0]._id)) {
        navigate("/home/patientDetails", { state });
      }
    } else {
      setLoading(false);
    }
  };

  let addFiles = async (files, id) => {
    console.log(files);
    let formData = new FormData();
    formData.append("fieldName", "medicRecord");
    formData.append("recId", id);
    formData.append("id", state);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    let add = await uploadFile(formData, "uploadFiles");
    console.log(add);
    return true;
  };

  return (
    <div className="main-content">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="container-fluid">
          {pageView ? (
            <>
              <div className="section">
                <h5 className="page-title">{type.replace("_", " ")}</h5>
              </div>
              <div className="section profile-section">
                <div className="card container">
                  <div className="card-body">
                    <div className="sub-section col-sm-8 col-md-12 col-lg-8">
                      <div className="sub-section-body">
                        <div className="user-password-form">
                          <form id="form" method="post">
                            <div className="form">
                              {htmlData?.map((e) => {
                                if (e[0] == "input") {
                                  return (
                                    <div
                                      className="form-group col-sm-8"
                                      id={e[2]}
                                    >
                                      <label>{e[1]}</label>
                                      <input
                                        className="form-control"
                                        name={e[2]}
                                        type={e[3]}
                                        required
                                      />
                                    </div>
                                  );
                                } else if (e[0] == "select") {
                                  return (
                                    <div
                                      className="form-group col-sm-3"
                                      id={e[2]}
                                    >
                                      <label>{e[1]}</label>
                                      <select
                                        className="form-control form-select dropdown-toggle"
                                        name={e[2]}
                                        required
                                        onChange={(d) => {
                                          console.log(d[2]);
                                          if (e[2] == "chronic") {
                                            return viewStill(d);
                                          } else {
                                            return viewEndDate(d);
                                          }
                                        }}
                                      >
                                        <option value="false">no</option>
                                        <option value="true">yes</option>
                                      </select>
                                    </div>
                                  );
                                } else if (e[0] == "textarea") {
                                  return (
                                    <div className="form-group col-sm-8">
                                      <label>{e[1]}</label>
                                      <textarea
                                        className="form-control "
                                        rows="3"
                                        maxlength="100"
                                        name={e[2]}
                                        required
                                      />
                                    </div>
                                  );
                                }
                              })}
                              <div className="form-group col-sm-8">
                                <label>upload files</label>
                                <input
                                  className="form-control"
                                  name="file"
                                  type="file"
                                  multiple
                                  accept="image/*,application/pdf"
                                  required
                                />
                              </div>
                            </div>
                          </form>
                          <button
                            className="btn btn-dark-red-f-gr mt-4"
                            type="button"
                            onClick={() => {
                              data();
                              /* setLoading(true); */
                            }}
                          >
                            <i className="las la-save" />
                            submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Categories view={"medic"} type={setType} pageView={setPageView} />
          )}
        </div>
      )}
    </div>
  );
};

export default AddMedicRecord;
