import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const PatientDetails = ({ role, superAdmin }) => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState();
  const [calView, setCalView] = useState(false);
  const [htmlData, setHtmlData] = useState([]);
  const [bottomBtns, setBottomBtns] = useState([]);

  const id = useLocation();
  const navigate = useNavigate();

  let createHtmlData = (state) => {
    let data = [
      ["gender", state.gender ? state.gender : "", "gender"],
      ["phone", state.phone ? state.phone : "", "phone number"],
      ["city", state.patientInfo?.city ? state.patientInfo.city : "", "city"],
      [
        "birthDate",
        state.patientInfo?.birthDate
          ? moment(state.patientInfo.birthDate).format("DD-MM-YYYY")
          : "",
        "date of birth",
      ],
    ];
    let arr = [
      [
        "-dark",
        () => {
          navigate(`/${role}/medicalRecord`, {
            state: id.state,
          });
        },
        "medical record",
        "la-notes-medical",
      ],
    ];
    if (role == "admin") {
      data.push(
        ["sta", state.isLoggedIn ? "Online" : "Offline", "member status"],
        [
          "reg",
          moment(state.createdAt).local().format("DD/MM/YYYY"),
          "registered date",
        ]
      );
      arr.push(
        [
          "-dark",
          () => {
            setCalView(true);
          },
          "view appointments",
          "la-calendar-day",
        ],
        [
          "",
          () => {
            resetPass();
          },
          "reset password",
          "la-lock",
        ]
      );
    }
    superAdmin &&
      arr.push([
        "",
        () => {
          userDelete();
        },
        "delete user",
        "la-trash",
      ]);
    setBottomBtns(arr);
    setHtmlData(data);
  };

  const GetDetails = async () => {
    let body = {
      filter: {
        _id: id.state,
      },
    };
    let user = await users(body);
    console.log(user);
    if (!user.users) {
      alert("patient not found");
      navigate(-1);
    } else {
      setState(user.users[0]);
      createHtmlData(user.users[0]);
      setLoading(false);
    }
  };

  const userDelete = async () => {
    let body = {
      id: id.state,
    };
    if (window.confirm("Are you sure you want to delete this user")) {
      let deleted = await deleteUser(body);
      alert(deleted.message);
      if (deleted.message == "user deleted") {
        navigate("/admin/patients");
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
    details.name = document.getElementById("name").value;
    details.patientInfo.birthDate = moment(
      details.patientInfo.birthDate,
      "DD-MM-YYYY"
    ).format("MM-DD-YYYY");
    let body = {
      details,
      id: state._id,
    };
    let update = await updateUser(body);
    alert(update.message);
  };

  const resetPass = async () => {
    if (window.confirm("Are you sure you want to reset user password")) {
      let body = {
        id: id.state,
      };
      let reset = await resetPassword(body);
      alert(reset.message);
    }
  };

  return (
    <>
      {calView ? (
        <Calendar filter={{ patientId: id.state }} role={role} />
      ) : (
        <div className="main-content">
          <div className="container-fluid">
            {loading ? (
              <LoadingSpinner />
            ) : (
              state && (
                <>
                  <DetailsHeader
                    role={role}
                    superAdmin={superAdmin}
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
                                  role={role}
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
                        <NotesCard id={state._id} role={role} />
                        {role == "admin" && (
                          <FilesCard
                            role={role}
                            files={state.files}
                            id={state._id}
                            fieldName={"users"}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PatientDetails;
