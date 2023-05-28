import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  updateUser,
  users,
  deleteUser,
  uploadFile,
  removeFile,
  resetPassword,
} from "../../adminAPI.js";
import FilesCard from "../../components/FilesCard.js";
import LoadingSpinner from "../../components/Loading.js";
import NotesCard from "../../components/NotesCard.js";
import manImg from "../../images/man.svg";
import Calendar from "../Calender.js";

const PatientDetails = () => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState();
  const [calView, setCalView] = useState(false);

  const id = useLocation();
  const navigate = useNavigate();

  const GetDetails = async () => {
    let body = {
      id: id.state,
    };
    let user = await users(body);
    setState(user.users);
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

  let age = moment().diff(state?.patientInfo?.birthDate, "years");

  const editPat = () => {
    let elements = document
      .getElementById("editDet")
      .getElementsByTagName("input");
    let iArr = Array.from(elements);
    let x = false;
    iArr.map((e) => {
      if (e.readOnly == true) {
        document.getElementById("name").removeAttribute("readOnly");
        document.getElementById("reg").setAttribute("readonly", true);
        document.getElementById("sta").setAttribute("readonly", true);
        e.removeAttribute("readOnly");
        document.getElementById("editPat").innerHTML = "submit";
        return (x = false);
      } else {
        e.setAttribute("readonly", true);
        document.getElementById("name").setAttribute("readonly", true);
        document.getElementById("reg").setAttribute("readonly", true);
        document.getElementById("editPat").innerHTML = "Edit Patient";
        return (x = true);
      }
    });
    if (x) {
      updatePat();
    }
  };

  const updatePat = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let body = {
      details: {
        email: formData.get("em"),
        gender: formData.get("gen"),
        phone: formData.get("ph"),
        patientInfo: {
          city: formData.get("ci"),
          address: formData.get("add"),
          birthDate: moment(formData.get("bd"), "DDMMYYY")
            .tz("GMT+2")
            .format("MM-DD-YYYY"),
        },
        name: document.getElementById("name").value,
      },
      id: state._id,
    };
    console.log(body);
    let update = await updateUser(body);
    alert(update.message);
    if (update.message == "update success") {
      setLoading(true);
      updatePat();
    }
  };

  let addProfilePic = async (e) => {
    console.log(e.target.files);
    let formData = new FormData();
    formData.append("fieldName", "users");
    formData.append("id", state._id);
    formData.append("image", e.target.files[0]);

    let add = await uploadFile(formData, "uploadProfilePic");
    if (add.message == "done") {
      setLoading(true);
      GetDetails();
    }
    console.log(add);
  };

  const removeProfilePic = async () => {
    let body = {
      id: state._id,
      path: state.image,
    };
    let deleted = await removeFile(body, "removeProfilePic");
    if (deleted.message == "image deleted") {
      setLoading(true);
      GetDetails();
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
    <React.Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : calView ? (
        <Calendar filter={{ patientId: id.state }} />
      ) : (
        <div className="main-content">
          {state ? (
            <div className="container-fluid">
              <div className="section row title-section">
                <div className="col-md-8">
                  <div aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/home/Patients">
                          <a>patients</a>
                        </Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        {state.name}
                      </li>
                    </ol>
                  </div>
                </div>
                <div className="col-md-4">
                  <button
                    id="editPat"
                    className="btn btn-dark-red-f-gr"
                    onClick={() => {
                      editPat();
                    }}
                  >
                    <i className="las la-edit" />
                    edit patient
                  </button>
                </div>
              </div>
              <div className="section patient-details-section">
                <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="card">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="mini-card text-center">
                                <div className="card-header">
                                  <img
                                    className="rounded-circle"
                                    src={state.image ? state.image : manImg}
                                    loading="lazy"
                                  />
                                </div>
                                <div className="card-body">
                                  <div className="">
                                    <button
                                      className="btn btn-red-f-gr btn-sm float-center"
                                      style={{ margin: "1em" }}
                                      onClick={() => {
                                        removeProfilePic();
                                      }}
                                    >
                                      <i className="las la-image" />
                                      delete
                                    </button>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      id="imgupload"
                                      style={{ display: "none" }}
                                      onChange={(e) => {
                                        addProfilePic(e);
                                      }}
                                    />
                                    <button
                                      className="btn btn-dark-red-f btn-sm float-center"
                                      style={{ margin: "1em" }}
                                      onClick={() => {
                                        document
                                          .getElementById("imgupload")
                                          .click();
                                      }}
                                    >
                                      <i className="las la-image" />
                                      change
                                    </button>
                                  </div>
                                  <input
                                    id="name"
                                    className="form-control"
                                    defaultValue={state.name}
                                    readOnly
                                    style={{ textAlign: "center" }}
                                  />

                                  <small className="text-muted">
                                    {state._id}
                                  </small>
                                  <h5>Age</h5>
                                  <p>{age}</p>
                                </div>
                              </div>
                            </div>

                            <div
                              id="editDet"
                              className="col-md-8 patients-details-card-wrapper"
                            >
                              <form id="form" method="post">
                                <div className="mini-card">
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <label>gender</label>
                                          <input
                                            name="gen"
                                            className="form-control"
                                            readOnly="readonly"
                                            defaultValue={state.gender}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <label>date of birth</label>
                                          <input
                                            name="bd"
                                            className="form-control"
                                            readOnly="readonly"
                                            defaultValue={
                                              state.patientInfo?.birthDate
                                                ? moment(
                                                    state.patientInfo?.birthDate
                                                  ).format("DD/MM/YYYY")
                                                : ""
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <label>phone number</label>
                                          <input
                                            name="ph"
                                            className="form-control"
                                            readOnly="readonly"
                                            defaultValue={state.phone}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <label>city</label>
                                          <input
                                            name="ci"
                                            className="form-control"
                                            readOnly="readonly"
                                            defaultValue={
                                              state.patientInfo?.city
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <label>member status</label>
                                          <input
                                            id="sta"
                                            className="form-control"
                                            readOnly="readonly"
                                            defaultValue={
                                              state?.isLoggedIn
                                                ? "Online"
                                                : "Offline"
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <label>registered date</label>
                                          <input
                                            id="reg"
                                            className="form-control"
                                            readOnly="readonly"
                                            defaultValue={moment(
                                              new Date(
                                                state.createdAt
                                              ).toLocaleDateString()
                                            ).format("DD/MM/YYYY")}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <label>email</label>
                                          <input
                                            name="em"
                                            className="form-control"
                                            readOnly="readonly"
                                            defaultValue={state.email}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <label>address</label>
                                          <input
                                            name="add"
                                            className="form-control"
                                            readOnly="readonly"
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
                      <div className="col-sm-12">
                        <div className="card">
                          <button
                            className="btn btn-dark-red-f-gr"
                            onClick={() => {
                              setCalView(true);
                            }}
                          >
                            <i className="las la-calendar-day" />
                            view appointments
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="card">
                          <button
                            className="btn btn-dark-red-f-gr"
                            onClick={() => {
                              navigate("/home/medicalRecord", {
                                state: id.state,
                              });
                            }}
                          >
                            <i className="las la-notes-medical" />
                            medical record
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="card">
                          <button
                            className="btn btn-red-f-gr"
                            onClick={() => {
                              resetPass();
                            }}
                          >
                            <i className="las la-lock" />
                            reset password
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="card">
                          <button
                            className="btn btn-red-f-gr"
                            onClick={() => {
                              userDelete();
                            }}
                          >
                            <i className="las la-trash" />
                            delete user
                          </button>
                        </div>
                      </div>

                      {/* <div className="col-sm-12">
                        <div className="card">
                          <div className="card-body">
                            <ul
                              className="nav nav-tabs"
                              id="myTab"
                              role="tablist"
                            >
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link active"
                                  id="upcoming-appointments-tab"
                                  data-toggle="tab"
                                  role="tab"
                                  aria-controls="upcoming-appointments"
                                  aria-selected="true"
                                >
                                  upcoming appointments
                                </button>
                              </li>
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link"
                                  id="past-appointments-tab"
                                  data-toggle="tab"
                                  role="tab"
                                  aria-controls="past-appointments"
                                  aria-selected="false"
                                >
                                  past appointments
                                </button>
                              </li>
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link"
                                  id="medical-records-tab"
                                  data-toggle="tab"
                                  role="tab"
                                  aria-controls="medical-records"
                                  aria-selected="false"
                                >
                                  medical records
                                </button>
                              </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                              <div
                                className="tab-pane fade show active"
                                id="upcoming-appointments"
                                role="tabpanel"
                                aria-labelledby="upcoming-appointments-tab"
                              >
                                <div className="section-title">
                                  <button className="btn btn-dark-red-f btn-sm">
                                    <i className="las la-calendar-plus" />
                                    create an appointment
                                  </button>
                                </div>
                                {reserves.length > 0
                                  ? reserves.map((res) => {
                                      if (res.status == false) {
                                        return (
                                          <div className="media">
                                            <div className="align-self-center">
                                              <p>
                                                {moment(
                                                  res.date,
                                                  "DD-MM-YYYY"
                                                ).format("dddd")}
                                              </p>
                                              <h4>
                                                {moment(res.date).format(
                                                  "DD/MM/YYYY"
                                                )}
                                              </h4>
                                            </div>
                                            <div className="media-body">
                                              <div className="row">
                                                <label className="label-blue-bl">
                                                  {res.visitType}
                                                </label>
                                                <p>with Dr. {res.docName}</p>
                                                <p>
                                                  {res.fees}
                                                  <i className="las la-dollar-sign " />
                                                </p>
                                                <p>
                                                  <i className="las la-clock" />
                                                  {moment(
                                                    res.time.from,
                                                    "HH:mm"
                                                  ).format("h:mm")}
                                                  -
                                                  {moment(
                                                    res.time.to,
                                                    "HH:mm"
                                                  ).format("h:mm A")}
                                                </p>
                                                {res.anotherPerson ? (
                                                  <p>
                                                    <i className="las la-user-alt" />
                                                    another Person
                                                  </p>
                                                ) : (
                                                  ""
                                                )}
                                                <Link
                                                  to="/home/reserveDetails"
                                                  state={res._id}
                                                >
                                                  <i className="las la-info-circle" />
                                                </Link>
                                                <label className="label-cream label-sm">
                                                  <i className="las la-hourglass-half" />
                                                  {moment(
                                                    moment(
                                                      moment(res.date).format(
                                                        "DD-MM-YYYY"
                                                      ) +
                                                        " " +
                                                        res.time.from,
                                                      "DD/MM/YYYY HH:mm"
                                                    )
                                                  ).fromNow()}
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    })
                                  : ""}
                              </div>
                              <div
                                className="tab-pane fade"
                                id="past-appointments"
                                role="tabpanel"
                                aria-labelledby="past-appointments-tab"
                              ></div>
                              <div
                                className="tab-pane fade"
                                id="medical-records"
                                role="tabpanel"
                                aria-labelledby="medical-records-tab"
                              ></div>
                            </div>
                          </div>
                          {reserves.length > 0 ? (
                            <div className="card-footer d-flex justify-content-end">
                              <Link
                                to="/home/PatientDetails/reservations"
                                id="editPat"
                                className="btn btn-dark-red-f-gr "
                                style={{ marginTop: "0.5em" }}
                              >
                                view more
                                <i className="las la-angle-right" />
                              </Link>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div> */}
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
          ) : (
            ""
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default PatientDetails;
