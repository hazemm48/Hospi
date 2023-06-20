import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { addUser, uploadFile } from "../../adminAPI.js";
import manImg from "../../images/male.jpg";
import LoadingSpinner from "../../components/Loading.js";
import { useNavigate } from "react-router-dom";

const AddPatient = () => {
  const [htmlData, setHtmlData] = useState();
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  let createHtmlData = () => {
    setHtmlData([
      ["Name", "name", "text"],
      ["Email", "email", "email"],
      ["Password", "password", "password"],
      ["City", "city", "text"],
      ["Address", "address", "text"],
      ["Birthday", "birthDate", "date"],
      ["Phone Number", "phone", "number"],
    ]);
  };

  useEffect(() => {
    createHtmlData();
  }, []);

  const data = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);

    let body = {
      patientInfo: {},
    };
    for (const pair of formData.entries()) {
      if (["city", "address", "birthDate"].includes(pair[0])) {
        body.patientInfo[pair[0]] = pair[1];
      } else {
        body[pair[0]] = pair[1];
      }
    }
    body.patientInfo.birthDate = moment(body.patientInfo.birthDate).format(
      "MM-DD-YYYY"
    );
    body.role = "patient";
    let file = body.profile;
    delete body.profile;

    let add = await addUser(body);
    alert(add.message);
    if (add.message == "doctor added") {
      if (addProfilePic(file, add.added[0]._id)) {
        navigate("/home/patientDetails", { state: add.added[0]._id });
      }
    } else {
      setLoading(false);
    }
  };

  let addProfilePic = async (file, id) => {
    let formData = new FormData();
    formData.append("fieldName", "users");
    formData.append("id", id);
    formData.append("image", file);

    let add = await uploadFile(formData, "uploadProfilePic");
    return true;
  };

  return (
    <div className="main-content">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="container-fluid">
          <div className="section">
            <h5 className="page-title">Add Patient</h5>
          </div>
          <div className="section profile-section">
            <div className="card container">
              <div className="col-md-3">
                <div className="card-header">
                  <img
                    className="rounded-circle"
                    width="80%"
                    src={manImg}
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="card-body">
                <div className="sub-section col-sm-8 col-md-12 col-lg-8">
                  <div className="sub-section-body">
                    <div className="user-password-form">
                      <form id="form" method="post">
                        <div className="form">
                          <div className="form-group col-sm-8">
                            <label>Profile Picture</label>
                            <input
                              className="form-control"
                              name="profile"
                              type="file"
                              accept="image/*"
                              required
                            />
                          </div>
                          {htmlData?.map((e) => {
                            return (
                              <div className="form-group col-sm-8">
                                <label>{e[0]}</label>
                                <input
                                  className="form-control"
                                  name={e[1]}
                                  type={e[2] ? e[2] : ""}
                                  required
                                />
                              </div>
                            );
                          })}
                          <div className="form-group col-sm-5">
                            <label>Gender</label>
                            <select
                              className="form-control form-select dropdown-toggle"
                              name="gender"
                              required
                            >
                              <option disabled selected>
                                -- choose gender --
                              </option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                        </div>
                      </form>
                      <button
                        className="btn btn-dark-red-f-gr mt-4"
                        type="button"
                        onClick={() => {
                          setLoading(true);
                          data();
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
        </div>
      )}
    </div>
  );
};

export default AddPatient;
