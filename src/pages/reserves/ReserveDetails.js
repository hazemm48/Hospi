import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { generatePresc, reserve } from "../../adminAPI.js";
import FeedBack from "../../components/FeedBack.js";
import FilesCard from "../../components/FilesCard.js";
import LoadingSpinner from "../../components/Loading.js";

const ReserveDetails = () => {
  let navigate = useNavigate();
  const id = useLocation();
  const [reserves, setReserves] = useState();
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState(false);
  const [feedData, setFeedData] = useState();
  let anPer = "";
  let type = "";

  const Data = async () => {
    let body = {
      oper: "get",
      data: {
        filter: {
          _id: id.state,
        },
      },
    };
    let reserveData = await reserve(body);
    setReserves(reserveData.reservations);
    setLoading(false);
  };
  if (reserves) {
    if (reserves[0].anotherPerson == true) {
      anPer = "yes";
    } else {
      anPer = "no";
    }
    type = reserves[0].type;
  }

  const Delete = async () => {
    let body = {
      oper: "cancel",
      data: {
        resId: id.state,
      },
    };
    console.log(body);
    let deleteReserve = await reserve(body);
    console.log(deleteReserve.message);
    alert(deleteReserve.message);
    if (deleteReserve.message == "reservation cancelled") {
      navigate(-1);
    }
  };

  useEffect(() => {
    setLoading(true);
    Data();
  }, []);

  const Edit = (e) => {
    console.log();
    let formEl = document.forms.form;
    let editBtn = e.target;
    if (editBtn.hasAttribute("data-edit")) {
      formEl.patName.removeAttribute("readOnly");
      formEl.fees.removeAttribute("readOnly");
      formEl.phone.removeAttribute("readOnly");
      formEl.visitType.removeAttribute("readOnly");
      editBtn.removeAttribute("data-edit");
      editBtn.innerHTML = "submit";
    } else {
      formEl.patName.setAttribute("readOnly", true);
      formEl.fees.setAttribute("readOnly", true);
      formEl.phone.setAttribute("readOnly", true);
      formEl.visitType.setAttribute("readOnly", true);
      editBtn.setAttribute("data-edit", true);
      editBtn.innerHTML = "Edit Reserve";
      updatePat();
    }
  };

  const updatePat = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let body = {
      oper: "edit",
      body: {
        details: {
          patName: formData.get("patName"),
          fees: formData.get("fees"),
          phone: formData.get("phone"),
          visitType: formData.get("visitType"),
        },
        id: id.state,
      },
    };
    let update = await reserve(body);
    if (update.message == "updated") {
      if (window.confirm("Reserve Updated Successfully")) {
        window.location.reload();
      }
    } else {
      alert("Wrong Data");
    }
    console.log(body);
  };

  const generatePrescription = async (e) => {
    let oper = e.target.name;
    if (oper == "pdf" && reserves[0].report.link) {
      window.open(reserves[0].report.link, "_blank");
    } else {
      let body = {
        oper: oper,
        resId: id.state,
      };
      let generate = await generatePresc(body);
      console.log(generate);
      if (oper == "pdf") {
        window.open(generate.pdf, "_blank");
      } else if (oper == "qr") {
        document
          .querySelector(".content")
          .insertAdjacentHTML("afterbegin", generate.qr);
      }
      setFeedData("Scan the qr code with your camera");
    }
  };

  return (
    <React.Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : reserves ? (
        <div className="main-content">
          {display && (
            <FeedBack
              display={display}
              data={feedData}
              setDisplay={setDisplay}
            />
          )}
          <div className="container-fluid">
            <div className="section patient-details-section">
              <div className="card ">
                <div className="">
                  <div className="col ">
                    <div className="mini-card text-center">
                      <div
                        className="card-body row"
                        style={{ justifyContent: "center" }}
                      >
                        <h3>{type} reserve</h3>
                        <small className="text-muted">{reserves[0]._id}</small>
                        {reserves[0].status ? (
                          <label
                            className="label-green"
                            style={{
                              padding: "0.3em",
                              borderRadius: "0.4em",
                              width: "5em",
                            }}
                          >
                            Done
                          </label>
                        ) : (
                          <label
                            className="label-blue"
                            style={{
                              padding: "0.3em",
                              borderRadius: "0.4em",
                              width: "5em",
                            }}
                          >
                            Pending
                          </label>
                        )}

                        <div className="d-flex justify-content-end ">
                          <button
                            id="deleteRes"
                            className="btn btn-red-f-gr col-md-2"
                            style={{
                              margin: "0.3em",
                            }}
                            onClick={() => {
                              Delete();
                            }}
                          >
                            <i className="las la-trash" />
                            {reserves[0].status
                              ? "delete reserve"
                              : "cancel reserve"}
                          </button>
                          <button
                            id="editRes"
                            className="btn btn-dark-red-f-gr col-md-2"
                            data-edit
                            style={{
                              margin: "0.3em",
                            }}
                            onClick={(e) => {
                              Edit(e);
                            }}
                          >
                            <i className="las la-edit" />
                            edit reserve
                          </button>
                        </div>
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
                            {type == "doctor" ? (
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
                            ) : (
                              ""
                            )}
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>
                                  {type == "doctor" ? "speciality" : "category"}
                                </label>
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
                            {type == "doctor" ? (
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>time</label>
                                  <input
                                    id="time"
                                    className="form-control"
                                    readOnly="readonly"
                                    defaultValue={
                                      reserves[0].time.from +
                                      " - " +
                                      reserves[0].time.to
                                    }
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label>sub Category</label>
                                  <input
                                    id="subCategory"
                                    className="form-control"
                                    readOnly="readonly"
                                    defaultValue={reserves[0].subCategory}
                                  />
                                </div>
                              </div>
                            )}

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
                            {type == "doctor" ? (
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
                            ) : (
                              ""
                            )}

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
                            {type == "doctor" ? (
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
                            ) : (
                              ""
                            )}

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
                            {type == "doctor" ? (
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
                            ) : (
                              ""
                            )}

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
                              {type == "doctor" && (
                                <Link
                                  to="/home/doctorDetails"
                                  state={reserves[0].doctorId}
                                  className="btn btn-dark-red-f btn-sm col-sm-2"
                                >
                                  <i className="las la-stethoscope" />
                                  View Doctor
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {reserves[0].status && (
                <div>
                  <h2 style={{ textAlign: "center" }}>Report</h2>
                  <div className="card">
                    <div>
                      <h3 style={{ color: "#0466c8" }}>
                        Prescription
                        <button
                          name="qr"
                          onClick={(e) => {
                            setDisplay(true);
                            generatePrescription(e);
                          }}
                          className="btn btn-dark-red-f float-right"
                        >
                          <i className="las la-qrcode" />
                          generate QR code
                        </button>
                        <button
                          name="pdf"
                          onClick={(e) => {
                            generatePrescription(e);
                          }}
                          className="btn btn-dark-red-f  float-right "
                          style={{ marginRight: "0.5em" }}
                        >
                          <i className="las la-file-alt" />
                          generate PDF
                        </button>
                      </h3>

                      <textarea
                        name="prescription"
                        className="form-control"
                        style={{ height: "auto" }}
                        defaultValue={reserves[0].report.prescription}
                        readOnly
                        rows={12}
                      />
                    </div>
                    <div>
                      <h3 style={{ color: "#0466c8" }}>Notes</h3>
                      <textarea
                        name="note"
                        className="form-control"
                        style={{ height: "auto" }}
                        defaultValue={reserves[0].report.note}
                        readOnly
                        rows={12}
                      />
                    </div>

                    <h3 style={{ color: "#0466c8" }}>Files</h3>

                    <FilesCard
                      id={id.state}
                      type={reserves[0].type}
                      fieldName={"reserves"}
                      files={reserves[0].report.files}
                    />
                  </div>
                </div>
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
