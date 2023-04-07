import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { reserve } from "../adminAPI.js";
import LoadingSpinner from "../components/Loading.js";

const ReserveDetails = () => {
  const id = useLocation();
  const [reserves, setReserves] = useState();
  const [loading, setLoading] = useState(true);
  let status = "";
  let anPer = "";

  const Data = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let body = {
      oper: "get",
      body: {
        filter: {
          _id: id.state,
        },
      },
    };
    let reserveData = await reserve(body);
    setReserves(reserveData);
    setLoading(false);
  };
  if (reserves) {
    if (reserves[0].status == true) {
      status = "done";
    } else {
      status = "pending";
    }
    if (reserves[0].anotherPerson == true) {
      anPer = "yes";
    } else {
      anPer = "no";
    }
  }

  useEffect(() => {
    setLoading(true);
    Data();
  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : reserves ? (
        <div className="main-content">
          <div className="container-fluid">
            <div className="section patient-details-section">
              <div className="card ">
                <div className="">
                  <div className="col d-flex justify-content-center">
                    <div className="mini-card text-center">
                      <div className="card-body row">
                        <h5>{reserves[0].type} reserve</h5>
                        <small className="text-muted">{reserves[0]._id}</small>
                        {reserves[0].status == true ? (
                          <label
                            className="label-green"
                            style={{ padding: "0.3em", borderRadius: "0.4em" }}
                          >
                            {status}
                          </label>
                        ) : (
                          <label
                            className="label-blue"
                            style={{ padding: "0.3em", borderRadius: "0.4em" }}
                          >
                            {status}
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    id="editDet"
                    className="col d-flex justify-content-center res"
                  >
                    <form id="form" method="post">
                      <div className="mini-card">
                        <div className="card-body">
                          <div className="row justify-content-center">
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>patient name</label>
                                <input
                                  name="patName"
                                  className="form-control"
                                  readOnly="readonly"
                                  defaultValue={reserves[0].patName}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>doctor name</label>
                                <input
                                  name="docName"
                                  className="form-control"
                                  readOnly="readonly"
                                  defaultValue={reserves[0].docName}
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
                                  defaultValue={reserves[0].speciality}
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
                                  defaultValue={reserves[0].fees}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>date</label>
                                <input
                                  id="date"
                                  className="form-control"
                                  readOnly="readonly"
                                  defaultValue={moment(reserves[0].date).format(
                                    "DD/MM/YYYY"
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>time</label>
                                <input
                                  id="time"
                                  className="form-control"
                                  readOnly="readonly"
                                  defaultValue={moment(
                                    reserves[0].time,
                                    "HH:mm"
                                  ).format("h:mm A")}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>phone</label>
                                <input
                                  name="phone"
                                  className="form-control"
                                  readOnly="readonly"
                                  defaultValue={reserves[0].phone}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>visit type</label>
                                <input
                                  name="visitType"
                                  className="form-control"
                                  readOnly="readonly"
                                  defaultValue={reserves[0].visitType}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>another person</label>
                                <input
                                  name="anotherPerson"
                                  className="form-control"
                                  readOnly="readonly"
                                  defaultValue={anPer}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>turn number</label>
                                <input
                                  name="turnNum"
                                  className="form-control"
                                  readOnly="readonly"
                                  defaultValue={reserves[0].turnNum}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>patient id</label>
                                <input
                                  name="patientId"
                                  className="form-control"
                                  readOnly="readonly"
                                  defaultValue={reserves[0].patientId}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>doctor id</label>
                                <input
                                  name="doctorId"
                                  className="form-control"
                                  readOnly="readonly"
                                  defaultValue={reserves[0].doctorId}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>created at</label>
                                <input
                                  name="createdAt"
                                  className="form-control"
                                  readOnly="readonly"
                                  defaultValue={moment(
                                    reserves[0].createdAt
                                  ).format("DD/MM/YYYY h:mm A")}
                                />
                              </div>
                            </div>
                            {moment(reserves[0].createdAt).format(
                              "DD/MM/YYYY h:mm A"
                            ) ==
                            moment(reserves[0].updatedAt).format(
                              "DD/MM/YYYY h:mm A"
                            ) ? (
                              ""
                            ) : (
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>updated at</label>
                                  <input
                                    name="updatedAt"
                                    className="form-control"
                                    readOnly="readonly"
                                    defaultValue={moment(
                                      reserves[0].updatedAt
                                    ).format("DD/MM/YYYY h:mm A")}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="card-footer">
                            <div className="d-flex justify-content-center">
                              <Link
                                to="/home/PatientDetails"
                                state={reserves[0].patientId}
                                className="btn btn-dark-red-f btn-sm col-sm-2"
                                style={{ marginRight: "0.4em" }}
                              >
                                <i className="las la-user-injured" />
                                View Patient
                              </Link>
                              <Link
                                to="/home/doctorDetails"
                                state={reserves[0].doctorId}
                                className="btn btn-dark-red-f btn-sm col-sm-2"
                              >
                                <i className="las la-stethoscope" />
                                View Doctor
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {reserves[0].status ? (
                <div>
                  <h2 style={{ textAlign: "center" }}>Report</h2>
                  <div className="card">
                    <div>
                      <h3 style={{ color: "#0466c8" }}>Prescription</h3>
                      <textarea
                        name="presc"
                        className="form-control"
                        style={{ height: "auto" }}
                        defaultValue=""
                        readOnly
                        rows={12}
                      />
                    </div>
                    <div>
                      <h3 style={{ color: "#0466c8" }}>Notes</h3>
                      <textarea
                        name="notes"
                        className="form-control"
                        style={{ height: "auto" }}
                        defaultValue=""
                        readOnly
                        rows={12}
                      />
                    </div>
                    <h3 style={{ color: "#0466c8" }}>Files</h3>

                    <div className="card files-card">
                      <div className="card-header">
                        <div className="d-flex justify-content-end">
                          <input
                            type="file"
                            multiple
                            accept="image/*,.pdf"
                            className="btn btn-dark-red-f btn-sm"
                          />
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="list-group list-group-flush">
                          <a className="list-group-item">
                            <i className="las la-file-excel" />
                            check up results.csv
                            <div className="float-right">
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
                      <div className="card-footer d-flex justify-content-end">
                        <button className="btn btn-dark-red-f btn-sm">
                          <i className="las la-file-medical" />
                          add files
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default ReserveDetails;
