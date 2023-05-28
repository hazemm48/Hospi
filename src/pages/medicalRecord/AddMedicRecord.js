import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../components/Loading.js";
import { useLocation, useNavigate } from "react-router-dom";
import Categories from "../../components/Categories.js";
import { medicList } from "./MedicRecordData.js";
import { medicalRecord, uploadFile } from "../../adminAPI.js";
import InputsHandler from "./InputsHandler.js";

const AddMedicRecord = () => {
  const [htmlData, setHtmlData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(false);
  const [pageView, setPageView] = useState(false);

  let { state } = useLocation();
  let navigate = useNavigate();

  let createHtmlData = () => {
    let data = medicList(type);
    console.log(data);
    setHtmlData(data);
  };

  useEffect(() => {
    if (pageView) {
      console.log("asd");
      createHtmlData();
    }
  }, [pageView]);

  const addRecord = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);

    let body = {
      type: htmlData.value,
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

    let add = await medicalRecord(body, "POST");
    console.log(add);
    alert(add.message);
    if (add.message == "added") {
      if (addFiles(files, add.added[0]._id)) {
        navigate("/home/medicalRecord", { state: state });
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
                          <form id="form">
                            <InputsHandler data={htmlData.data} />
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
                          </form>
                          <button
                            className="btn btn-dark-red-f-gr mt-4"
                            type="button"
                            onClick={() => {
                              addRecord();
                              setLoading(true);
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
            <Categories pageView={setPageView} view={"medic"} type={setType} />
          )}
        </div>
      )}
    </div>
  );
};

export default AddMedicRecord;
