import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addReport, generatePresc, reserve } from "../../adminAPI.js";
import FeedBack from "../../components/FeedBack.js";
import FilesCard from "../../components/FilesCard.js";
import LoadingSpinner from "../../components/Loading.js";
import { resDetList } from "./ReserveDetailsData.js";

const ReserveDetails = ({ role,superAdmin }) => {
  let navigate = useNavigate();
  const id = useLocation();
  const [reserves, setReserves] = useState();
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState(false);
  const [feedData, setFeedData] = useState();
  const [htmlData, setHtmlData] = useState([]);
  const [headBtns, setHeadBtns] = useState([]);
  const [type, setType] = useState();

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
    let data = reserveData.reservations[0];
    setHtmlData(resDetList(data.type, data, role));
    setHeadBtns(headBtn(data));
    setReserves(data);
    setType(data.type);
    setLoading(false);
  };

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
    let formEl = document.forms.form;
    let editBtn = e.target;
    if (editBtn.hasAttribute("data-edit")) {
      formEl.patName.removeAttribute("readOnly");
      formEl.fees.removeAttribute("readOnly");
      formEl.phone.removeAttribute("readOnly");
      formEl.visitType?.removeAttribute("readOnly");
      editBtn.removeAttribute("data-edit");
      editBtn.innerHTML = "submit";
    } else {
      formEl.patName.setAttribute("readOnly", true);
      formEl.fees.setAttribute("readOnly", true);
      formEl.phone.setAttribute("readOnly", true);
      formEl.visitType?.setAttribute("readOnly", true);
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
      data: {
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
    console.log(update);
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
    if (oper == "pdf" && reserves.report.link) {
      window.open(reserves.report.link, "_blank");
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

  let headBtn = (reserves) => {
    let arr = [];
    if (role == "admin") {
      arr.push(
        [
          "deleteRes",
          "",
          () => {
            Delete();
          },
          "la-trash",
          reserves.status ? "delete reserve" : "cancel reserve",
        ],
        [
          "editRes",
          "-dark",
          (e) => {
            Edit(e);
          },
          "la-edit",
          "edit reserve",
        ]
      );
    } else if (role == "patient") {
      !reserves.status &&
        arr.push([
          "deleteRes",
          "",
          () => {
            Delete();
          },
          "la-trash",
          "cancel reserve",
        ]);
    }
    console.log(arr);
    return arr;
  };

  const addReserveReport = async () => {
    let body = {
      resId: id.state,
      prescription: document.getElementById("presc").value,
      note: document.getElementById("note").value,
    };
    let { message } = await addReport(body);
    console.log(message);
    if (message == "added") {
      alert("report saved");
    } else {
      alert("something went wrong try again");
    }
  };

  return (
    <>
      <div className="main-content">
        {display && (
          <FeedBack display={display} data={feedData} setDisplay={setDisplay} />
        )}
        <div className="container-fluid">
          {loading ? (
            <LoadingSpinner />
          ) : (
            reserves && (
              <div className="section patient-details-section">
                <div className="card ">
                  <div className="">
                    <div className="col ">
                      <div className="mini-card text-center">
                        <div
                          className="card-body row"
                          style={{ justifyContent: "center", display: "block" }}
                        >
                          <h3>{type} reserve</h3>
                          <small className="text-muted">{reserves._id}</small>
                          {reserves.status ? (
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
                            {headBtns.map((e) => {
                              console.log(e);
                              return (
                                <button
                                  id={e[0]}
                                  className={`btn btn${e[1]}-red-f-gr col-md-2`}
                                  data-edit
                                  style={{
                                    margin: "0.3em",
                                  }}
                                  onClick={e[2]}
                                >
                                  <i className={`las ${e[3]}`} />
                                  {e[4]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      id="editDet"
                      className="col d-flex justify-content-center res"
                    >
                      <form id="form">
                        <div className="mini-card">
                          <div className="card-body">
                            <div className="row justify-content-center">
                              {htmlData.map((e) => {
                                return (
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label>{e[0]}</label>
                                      <input
                                        name={e[1]}
                                        className="form-control"
                                        readOnly
                                        defaultValue={e[2]}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            {role != "patient" && (
                              <div className="card-footer">
                                <div className="d-flex justify-content-center">
                                  {reserves.patientId && (
                                    <Link
                                      to={`/${role}/PatientDetails`}
                                      state={reserves.patientId}
                                      className="btn btn-dark-red-f btn-sm col-sm-2"
                                      style={{ marginRight: "0.4em" }}
                                    >
                                      <i className="las la-user-injured" />
                                      View Patient
                                    </Link>
                                  )}

                                  {type == "doctor" && role == "admin" && (
                                    <Link
                                      to="/admin/doctorDetails"
                                      state={reserves.doctorId}
                                      className="btn btn-dark-red-f btn-sm col-sm-2"
                                    >
                                      <i className="las la-stethoscope" />
                                      View Doctor
                                    </Link>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {(reserves.status || role == "doctor") && (
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
                        {role == "doctor" && (
                          <button
                            name="submitPresc"
                            onClick={() => {
                              addReserveReport();
                            }}
                            className="btn label-green  float-right "
                            style={{ margin: "0.5em" }}
                          >
                            <i className="las la-save" />
                            save
                          </button>
                        )}

                        <textarea
                          id="presc"
                          name="prescription"
                          className="form-control"
                          style={{ height: "auto" }}
                          defaultValue={reserves.report.prescription}
                          readOnly={role != "doctor" ? true : false}
                          rows={12}
                        />
                      </div>
                      {(role == "doctor" || superAdmin) && (
                        <div>
                          <h3 style={{ color: "#0466c8" }}>Notes</h3>
                          <textarea
                            id="note"
                            name="note"
                            className="form-control"
                            style={{ height: "auto" }}
                            defaultValue={reserves.report.note}
                            readOnly={role != "doctor" ? true : false}
                            rows={12}
                          />
                        </div>
                      )}

                      <h3 style={{ color: "#0466c8" }}>Files</h3>

                      <FilesCard
                        role={role}
                        id={id.state}
                        type={reserves.type}
                        fieldName={"reserves"}
                        files={reserves.report.files}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default ReserveDetails;
