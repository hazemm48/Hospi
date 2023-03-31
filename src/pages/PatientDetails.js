import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { updateUser, users } from "../adminAPI.js";

const PatientDetails = () => {
  const id = useLocation();
  let status = "";
  const [state, setState] = useState();

  useEffect(() => {
    const GetDetails = async () => {
      let body = {
        id: id.state,
      };
      let user = await users(body);
      setState(user);
    };
    GetDetails();
  }, []);

  if (state?.isLoggedIn == true) {
    status = "Online";
  } else {
    status = "Offline";
  }

  let age = moment().diff(state?.patientInfo?.birthDate, "years");
  console.log(age);

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
          birthDate: moment(formData.get("bd"),'DDMMYYY').tz('GMT+2').format('MM-DD-YYYY'),
        },
        name: document.getElementById("name").value,
      },
      id: state._id,
    };
    console.log(body);
    let update = await updateUser(body);
    if (update.message == "update success") {
      if (window.confirm("Patient Updated Successfully")) {
        window.location.reload();
      }
    } else {
      alert("Wrong Data");
    }
    console.log(body);
  };
  if (state) {
    return (
      <div className="main-content">
        <div className="container-fluid">
          <div className="section row title-section">
            <div className="col-md-8">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home/Patients">
                      <a>patients</a>
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {state.name}
                  </li>
                </ol>
              </nav>
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
                                src="https://placebeard.it/640x360"
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
                                         moment(state.patientInfo?.birthDate).format('DD/MM/YYYY') 
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
                                        defaultValue={state.patientInfo?.city}
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
                                        defaultValue={status}
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
                      <div className="card-body">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                          <li className="nav-item" role="presentation">
                            <a
                              className="nav-link active"
                              id="upcoming-appointments-tab"
                              data-toggle="tab"
                              role="tab"
                              aria-controls="upcoming-appointments"
                              aria-selected="true"
                            >
                              upcoming appointments
                            </a>
                          </li>
                          <li className="nav-item" role="presentation">
                            <a
                              className="nav-link"
                              id="past-appointments-tab"
                              data-toggle="tab"
                              role="tab"
                              aria-controls="past-appointments"
                              aria-selected="false"
                            >
                              past appointments
                            </a>
                          </li>
                          <li className="nav-item" role="presentation">
                            <a
                              className="nav-link"
                              id="medical-records-tab"
                              data-toggle="tab"
                              role="tab"
                              aria-controls="medical-records"
                              aria-selected="false"
                            >
                              medical records
                            </a>
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
                            <div className="media">
                              <div className="align-self-center">
                                <p>tue</p>
                                <h3>05</h3>
                                <p>2020</p>
                              </div>
                              <div className="media-body">
                                <div className="row">
                                  <label className="label-green-bl">
                                    consultation
                                  </label>
                                  <p>with Dr. Jekyll</p>
                                  <p>
                                    <i className="las la-tv" />
                                    on zoom
                                  </p>
                                  <p>
                                    <i className="las la-clock" />
                                    10.30 - 11.00
                                  </p>
                                  <label className="label-cream label-sm">
                                    <i className="las la-hourglass-half" />
                                    30 min
                                  </label>
                                  <a>
                                    <i className="las la-ellipsis-v" />
                                  </a>
                                </div>
                                <div className="row">
                                  <label className="label-blue-bl">
                                    root canal
                                  </label>
                                  <p>with Dr. Jekyll</p>
                                  <p>
                                    <i className="las la-tv" />
                                    on zoom
                                  </p>
                                  <p>
                                    <i className="las la-clock" />
                                    13.30 - 14.15
                                  </p>
                                  <label className="label-cream label-sm">
                                    <i className="las la-hourglass-half" />
                                    45 min
                                  </label>
                                  <a>
                                    <i className="las la-ellipsis-v" />
                                  </a>
                                </div>
                              </div>
                            </div>
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
                      rows={6}
                      defaultValue={""}
                    />
                    <button className="btn btn-dark-red-f float-right btn-sm">
                      <i className="las la-save" />
                      save note
                    </button>
                  </div>
                  <div className="card-footer">
                    <div className="float-left">
                      <p>
                        <i className="las la-user" />
                        dr. jekyll
                      </p>
                    </div>
                    <div className="float-right">
                      <p>04, may, 2020</p>
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
      </div>
    );
  }
};

export default PatientDetails;
