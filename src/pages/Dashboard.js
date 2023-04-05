import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { users, reserve } from "../../src/adminAPI";
import manImg from "../images/man.svg";
import moment from "moment";
import LoadingSpinner from "../components/Loading.js";

const Dashboard = (props) => {
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState();
  const [patients, setPatients] = useState();
  const [doctors, setDoctors] = useState();
  const [admins, setAdmins] = useState();
  const [reserveUsers, setReserveUsers] = useState();

  const GetDetails = async () => {
    let body = {
      role: "all",
      sort: "-createdAt",
    };
    let res = await users(body);
    let user = res.users;
    setAllUsers(user);
    let pats = user.filter((e) => {
      return e.role === "patient";
    });
    let docs = user.filter((e) => {
      return e.role === "doctor";
    });
    let admins = user.filter((e) => {
      return e.role === "admin";
    });
    let resBody = {
      oper: "get",
      body: {
        filter: {},
        sort:"-date"
      },
    };
    let reserves = await reserve(resBody);
    setLoading(false)
    setReserveUsers(reserves);
    setAdmins(admins);
    setPatients(pats);
    setDoctors(docs);
  };

  useEffect(() => {
    setLoading(true)  
    GetDetails();
  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="main-content">
          <div className="container-fluid">
            <div className="section">
              <div className="row">
                <div className="col-md-6">
                  <h5 className="page-title">Dashboard</h5>
                </div>
              </div>
            </div>
            <div className="section welcome-section">
              <div className="section-content">
                <div className="card-deck">
                  <div className="card welcome-content-card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-9 welcome-text-wrapper align-self-center">
                          <h3>
                            Hello,
                            <span style={{ color: "#0466c8" }}>
                              {props.name}
                            </span>
                          </h3>
                          <h5>Welcome to your dashboard</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card app-stats-card">
                    <div className="card-body">
                      <div className="row text-center">
                        <div className="col-md-4">
                          <i className="las la-user-injured la-3x align-self-center" />
                          <p>total patients</p>
                          <h4>{patients?.length}</h4>
                        </div>
                        <div className="col-md-4">
                          <i className="las la-stethoscope la-3x align-self-center" />
                          <p>total doctors</p>
                          <h4>{doctors?.length}</h4>
                        </div>
                        <div className="col-md-4">
                          <i className="las la-calendar-check la-3x align-self-center" />
                          <p>total reservations</p>
                          <h4>{reserveUsers?.length}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section functionality-section">
              <div className="section-content">
                <div className="card-deck">
                  <Link to="/home/addDoctor" className="card text-center">
                    <div className="card-title">
                      <div className="icon-wrapper">
                        <i className="las la-user-md" />
                      </div>
                    </div>
                    <div className="card-body">
                      <p>add a doctor</p>
                    </div>
                  </Link>
                  <Link to="/home/addPatient" className="card text-center">
                    <div className="card-title">
                      <div className="icon-wrapper">
                        <i className="las la-user-plus" />
                      </div>
                    </div>
                    <div className="card-body">
                      <p>add a patient</p>
                    </div>
                  </Link>
                  {props.email == "admin@hospi.com" ? (
                    <Link to="/home/addAdmin" className="card text-center">
                      <div className="card-title">
                        <div className="icon-wrapper">
                          <i className="las la-user-lock" />
                        </div>
                      </div>
                      <div className="card-body">
                        <p>add an admin</p>
                      </div>
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="section card-summaries">
              <div className="section-content">
                <div className="card-deck">
                  <div className="card">
                    <div className="card-header">
                      <h5>top treatments</h5>
                    </div>
                    <div className="card-body">
                      <ol type={1}>
                        <li>consultation</li>
                        <li>scaling</li>
                        <li>root canal</li>
                        <li>bleaching</li>
                        <li>transplants</li>
                        <li>cesarean</li>
                        <li>x-rays</li>
                      </ol>
                    </div>
                    <div className="card-footer">
                      <a className="view-more">
                        more
                        <i className="las la-angle-right" />
                      </a>
                    </div>
                  </div>
                  <div className="card total-counts-summary">
                    <div className="card-header">
                      <h5>total counts</h5>
                    </div>
                    <div className="card-body">
                      <div className="row text-center text-capitalize">
                        <div className="col-md-6">
                          <i className="las la-users la-2x mb-1" />
                          <h4 className="mb-1">{allUsers?.length}</h4>
                          <p>total users</p>
                        </div>
                        <div className="col-md-6">
                          <i className="las la-stethoscope la-2x mb-1" />
                          <h4 className="mb-1">{doctors?.length}</h4>
                          <p>total doctors</p>
                        </div>
                        <div className="col-md-6">
                          <i className="las la-user-injured la-2x mb-1" />
                          <h4 className="mb-1">{patients?.length}</h4>
                          <p>total patients</p>
                        </div>
                        <div className="col-md-6">
                          <i className="las la-user-shield la-2x mb-1" />
                          <h4 className="mb-1">{admins?.length}</h4>
                          <p>total admins</p>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <a className="view-more">
                        more
                        <i className="las la-angle-right" />
                      </a>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      <h5>recent patients</h5>
                    </div>
                    <div className="card-body">
                      <table className="table table-hover table-responsive-md table-borderless">
                        <tbody>
                          {patients?.slice(0, 4).map((pat) => {
                            return (
                              <tr>
                                <td>
                                  <img
                                    className="rounded-circle"
                                    src={manImg}
                                    loading="lazy"
                                  />
                                </td>
                                <td>
                                  <p>{pat.name}</p>
                                  <small className="text-muted">
                                    {pat.gender}
                                  </small>
                                </td>
                                <td>
                                  <p className="text-muted">
                                    {moment().diff(
                                      pat.patientInfo?.birthDate,
                                      "years"
                                    )}
                                  </p>
                                </td>
                                <td>
                                  <Link
                                    to="/home/patientDetails"
                                    state={pat._id}
                                    className="btn btn-sm"
                                  >
                                    <i className="las la-info-circle" />
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="card-footer">
                      <Link to="/home/patients" className="view-more">
                        more
                        <i className="las la-angle-right" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="card-deck">
                  <div className="card">
                    <div className="card-header">
                      <h5>doctors lists</h5>
                    </div>
                    <div className="card-body">
                      <table className="table table-borderless table-hover table-responsive-md">
                        <tbody>
                          {doctors
                            ? doctors.map((doc) => {
                                return (
                                  <tr>
                                    <td>
                                      <img
                                        className="rounded-circle"
                                        src={manImg}
                                        loading="lazy"
                                      />
                                    </td>
                                    <td>
                                      <p>{doc.name}</p>
                                      <small className="text-muted">
                                        {doc?.doctorInfo?.speciality}
                                      </small>
                                    </td>
                                    <td>
                                      <p className="text-muted">{doc.gender}</p>
                                    </td>
                                    <td className="text-right">
                                      <p>{doc.phone}</p>
                                    </td>
                                    <td className="text-right">
                                      <button className="btn btn-dark-red-f btn-sm">
                                        reserve
                                      </button>
                                    </td>
                                    <td>
                                      <Link
                                        to="/home/doctorDetails"
                                        state={doc._id}
                                        className="btn btn-sm"
                                      >
                                        <i className="las la-info-circle" />
                                      </Link>
                                    </td>
                                  </tr>
                                );
                              })
                            : ""}
                        </tbody>
                      </table>
                    </div>
                    <div className="card-footer">
                      <Link to="/home/doctors" className="view-more">
                        more
                        <i className="las la-angle-right" />
                      </Link>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      <h5>upcoming doctors appointments</h5>
                    </div>
                    <div className="card-body">
                      <table className="table table-borderless table-hover table-responsive-md">
                        <tbody>
                          {reserveUsers
                            ? reserveUsers.map((reserve) => {
                                if (
                                  reserve.type == "doctor" &&
                                  !reserve.status
                                ) {
                                  return (
                                    <tr>
                                      <td>
                                        <img
                                          className="rounded-circle"
                                          src={manImg}
                                          loading="lazy"
                                        />
                                      </td>
                                      <td>
                                        <p>{reserve.patName}</p>
                                      </td>
                                      <td>
                                        <p>Dr. {reserve.docName}</p>
                                        <small className="text-muted">
                                          {reserve.specialty}
                                        </small>
                                      </td>
                                      <td className="text-muted">
                                        <p>{moment(reserve.date).format('DD/MM/YYYY') }</p>
                                      </td>
                                      <td className="text-muted">
                                        <p>{moment(reserve.time,"HH:mm").format('h:mm A')}</p>
                                      </td>
                                      <td>
                                        <Link
                                          to="/home/reservationDetails"
                                          state={reserve._id}
                                          className="btn btn-sm"
                                        >
                                          <i className="las la-info-circle" />
                                        </Link>
                                      </td>
                                    </tr>
                                  );
                                }
                              })
                            : ""}
                        </tbody>
                      </table>
                    </div>
                    <div className="card-footer">
                      <Link to="/home/reservations" className="view-more">
                        more
                        <i className="las la-angle-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Dashboard;
