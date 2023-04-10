import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { updateUser, users, reserve } from "../adminAPI.js";
import LoadingSpinner from "../components/Loading.js";
import manImg from "../images/man.svg";

const DoctorDetails = () => {
  const id = useLocation();
  let status = "";
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState();
  const [reserves, setreserves] = useState();

  const GetDetails = async () => {
    let body = {
      id: id.state,
    };
    let user = await users(body);
    setState(user.users);
    setLoading(false);
  };

  const GetReserves = async () => {
    let body = {
      oper: "get",
      body: {
        filter: {
          doctorId: id.state,
        },
        limit: 6,
        sort: "date",
      },
    };
    let reserves = await reserve(body);
    setreserves(reserves.reservations);
  };

  useEffect(() => {
    setLoading(true);
    GetDetails();
    //GetReserves();
  }, []);

  let age = moment().diff(state?.doctorInfo?.birthDate, "years");

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
        document.getElementById("bio").removeAttribute("readonly");
        e.removeAttribute("readOnly");
        document.getElementById("editPat").innerHTML = "submit";
        return (x = false);
      } else {
        e.setAttribute("readonly", true);
        document.getElementById("name").setAttribute("readonly", true);
        document.getElementById("reg").setAttribute("readonly", true);
        document.getElementById("bio").setAttribute("readonly", true);
        document.getElementById("editPat").innerHTML = "Edit doctor";
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
        doctorInfo: {
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
    if (update.message == "update success") {
      if (window.confirm("doctor Updated Successfully")) {
        window.location.reload();
      }
    } else {
      alert("Wrong Data");
    }
    console.log(body);
  };
  return (
    <React.Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="main-content">
          {state ? (
            <div className="container-fluid">
              <div className="section row title-section">
                <div className="col-md-8">
                  <div aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/home/doctors">
                          <a>doctors</a>
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
                    edit doctor
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
                                    src={manImg}
                                    loading="lazy"
                                  />
                                </div>
                                <div className="card-body">
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
                              className="col-md-8 doctors-details-card-wrapper"
                            >
                              <form id="form" method="post">
                                <div className="mini-card">
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <label>gender</label>
                                          <input
                                            name="gender"
                                            className="form-control"
                                            readOnly="readonly"
                                            defaultValue={state.gender}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <label>speciality</label>
                                          <input
                                            name="speciality"
                                            className="form-control"
                                            readOnly="readonly"
                                            defaultValue={
                                              state.doctorInfo?.speciality
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <label>phone number</label>
                                          <input
                                            name="phone"
                                            className="form-control"
                                            readOnly="readonly"
                                            defaultValue={state.phone}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <label>room</label>
                                          <input
                                            name="room"
                                            className="form-control"
                                            readOnly="readonly"
                                            defaultValue={
                                              state.doctorInfo?.room
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <label>fees</label>
                                          <input
                                            name="fees"
                                            className="form-control"
                                            readOnly="readonly"
                                            defaultValue={
                                              state.doctorInfo?.fees
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <label>city</label>
                                          <input
                                            name="city"
                                            className="form-control"
                                            readOnly="readonly"
                                            defaultValue={
                                              state.doctorInfo?.city
                                            }
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
                                              state.doctorInfo?.birthDate
                                                ? moment(
                                                    state.doctorInfo?.birthDate
                                                  ).format("DD/MM/YYYY")
                                                : ""
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
                                            name="email"
                                            className="form-control"
                                            readOnly="readonly"
                                            defaultValue={state.email}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <label>bioghraphy</label>
                                          <textarea
                                            id="bio"
                                            className="form-control"
                                            rows={6}
                                            readOnly="readonly"
                                            defaultValue={
                                              state.doctorInfo?.address
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
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card notes-card">
                      <div className="card-header">
                        <h5>
                          notes
                          <button className="btn btn-dark-red-f btn-sm">
                            see all
                          </button>
                        </h5>
                      </div>
                      <div className="card-body">
                        <textarea
                          className="form-control"
                          placeholder="you can write patient notes over here"
                          rows={16}
                          defaultValue={""}
                        />
                        <button className="btn btn-dark-red-f float-right btn-sm">
                          <i className="las la-save" />
                          save note
                        </button>
                      </div>
                      <div className="card-footer">
                        <div className="float-right">
                          <p>{moment().format("DD, MMM, YYYY")}</p>
                        </div>
                      </div>
                    </div>
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

export default DoctorDetails;
