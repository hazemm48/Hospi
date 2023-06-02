import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import {
  updateUser,
  users,
  deleteUser,
  resetPassword,
} from "../../adminAPI.js";
import DetailsBottom from "../../components/DetailsBottom.js";
import DetailsHeader from "../../components/DetailsHeader.js";
import DetailsLeftSection from "../../components/DetailsLeftSection.js";
import FilesCard from "../../components/FilesCard.js";
import LoadingSpinner from "../../components/Loading.js";
import NotesCard from "../../components/NotesCard.js";
import Calendar from "../Calender.js";

const PatientDetails = () => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState();
  const [calView, setCalView] = useState(false);
  const [htmlData, setHtmlData] = useState([]);
  const [bottomBtns, setBottomBtns] = useState([]);


  const id = useLocation();
  const navigate = useNavigate();

  let createHtmlData = (state) => {
    setHtmlData([
      ["gender", state.gender, "gender"],
      ["phone", state.phone, "phone number"],
      ["city", state.patientInfo.city, "city"],
      [
        "birthDate",
        moment(state.patientInfo.birthDate).format("DD-MM-YYYY"),
        "date of birth",
      ],
      ["sta", state.isLoggedIn ? "Online" : "Offline", "member status"],
      [
        "reg",
        moment(state.createdAt).local().format("DD/MM/YYYY"),
        "registered date",
      ],
    ])
    setBottomBtns([
      [
        "-dark",
        () => {
          setCalView(true);
        },
        "view appointments",
        "la-calendar-day"
      ],
      [
        "-dark",
        () => {
          navigate("/home/medicalRecord", {
            state: id.state,
          });
        },
        "medical record",
        "la-notes-medical",
      ],
      [
        "",
        () => {
          resetPass();
        },
        "reset password",
        "la-lock"
      ],
      [
        "",
        () => {
          userDelete();
        },
        "delete user",
        "la-trash"
      ],
    ]);
  
  }

  const GetDetails = async () => {
    let body = {
      id: id.state,
    };
    let user = await users(body);
    setState(user.users);
    createHtmlData(user.users)
    setLoading(false);
  };

  const userDelete = async () => {
    let body = {
      id: id.state,
    };
    if (window.confirm("Are you sure you want to delete this user")) {
      let deleted = await deleteUser(body);
      alert(deleted.message);
      if (deleted.message == "user deleted") {
        navigate("/home/patients");
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    GetDetails();
  }, []);

  const updateUserDetails = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let details = {
      patientInfo: {},
    };
    for (const pair of formData.entries()) {
      if (!["email", "gender", "phone"].includes(pair[0])) {
        details.patientInfo[pair[0]] = pair[1];
      } else {
        details[pair[0]] = pair[1];
      }
    }
    details.name=document.getElementById("name").value
    details.patientInfo.birthDate = moment(details.patientInfo.birthDate).format(
      "MM-DD-YYYY"
    );
    let body = {
      details,
      id: state._id,
    };
    console.log(body);
    let update = await updateUser(body);
    alert(update.message);
    if (update.message == "update success") {
      window.location.reload();
    }
  };

  const resetPass = async () => {
    if (window.confirm("Are you sure you want to reset user password")) {
      let body = {
        id: state._id,
      };
      let reset = await resetPassword(body);
      alert(reset.message);
      console.log(reset);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : calView ? (
        <Calendar filter={{ patientId: id.state }} />
      ) : (
        <div className="main-content">
          {state && (
            <div className="container-fluid">
              <DetailsHeader
                name={state.name}
                type={"patient"}
                updateUserDetails={updateUserDetails}
              />
              <div className="section patient-details-section">
                <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <div id="userDet" className="col-sm-12">
                        <div className="card">
                          <div className="row">
                            <DetailsLeftSection
                              data={state}
                              type={"patient"}
                              GetDetails={GetDetails}
                              setLoading={setLoading}
                            />
                            <div
                              id="editDet"
                              className="col-md-8 patients-details-card-wrapper"
                            >
                              <form id="form">
                                <div className="mini-card">
                                  <div className="card-body">
                                    <div className="row">
                                    {htmlData.map((e) => {
                                        return (
                                          <div className="col-md-4">
                                            <div className="form-group">
                                              <label>{e[2]}</label>
                                              <input
                                                name={e[0]}
                                                className="form-control"
                                                disabled
                                                required
                                                defaultValue={e[1]}
                                              />
                                            </div>
                                          </div>
                                        );
                                      })}
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <label>email</label>
                                          <input
                                            name="email"
                                            className="form-control"
                                            disabled
                                            defaultValue={state.email}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <label>address</label>
                                          <input
                                            name="address"
                                            className="form-control"
                                            disabled
                                            defaultValue={
                                              state.patientInfo?.address
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DetailsBottom arr={bottomBtns} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <NotesCard id={state._id} />
                    <FilesCard
                      files={state.files}
                      id={state._id}
                      fieldName={"users"}
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

export default PatientDetails;
