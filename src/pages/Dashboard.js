import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { users, reserve } from "../../src/adminAPI";
import moment from "moment";

const Dashboard = (props) => {
  const [allUsers, setAllUsers] = useState();
  const [patients, setPatients] = useState();
  const [doctors, setDoctors] = useState();
  const [admins, setAdmins] = useState();
  const [reserveUsers, setReserveUsers] = useState();

  useEffect(() => {
    const GetDetails = async () => {
      let body = {
        role: "all",
      };
      let user = await users(body);
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
        },
      };
      let reserves = await reserve(resBody);
      setReserveUsers(reserves);
      setAdmins(admins);
      setPatients(pats);
      setDoctors(docs);
    };
    GetDetails();
  }, []);

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section">
          <div className="row">
            <div className="col-md-6">
            <h5 className="page-title" >Dashboard</h5>
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
                        <span style={{ color: "crimson" }}>{props.name}</span>
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
                      <h4>
                        {reserveUsers?.length}
                      </h4>
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
              {props.email=="admin@hospi.com"?(<Link to="/home/addAdmin" className="card text-center">
                <div className="card-title">
                  <div className="icon-wrapper">
                    <i className="las la-user-lock" />
                  </div>
                </div>
                <div className="card-body">
                  <p>add an admin</p>
                </div>
              </Link>):""}
              
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
                      <tr>
                        <td>
                          <img
                            className="rounded-circle"
                            src="../SiteAssets/images/man.svg"
                            loading="lazy"
                          />
                        </td>
                        <td>
                          <p>john doe</p>
                          <small className="text-muted">dentist</small>
                        </td>
                        <td>
                          <p className="text-muted">male</p>
                        </td>
                        <td>
                          <button className="btn btn-sm">
                            <i className="las la-ellipsis-h" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="card-footer">
                  <a className="view-more">
                    more
                    <i className="las la-angle-right" />
                  </a>
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
                                    src="../SiteAssets/images/man.svg"
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
                                  <button className="btn btn-sm">
                                    <i className="las la-info-circle" />
                                  </button>
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
                  <h5>upcoming appointments</h5>
                </div>
                <div className="card-body">
                  <table className="table table-borderless table-hover table-responsive-md">
                    <tbody>
                      <tr>
                        <td>
                          <img
                            className="rounded-circle"
                            src="../SiteAssets/images/man.svg"
                            loading="lazy"
                          />
                        </td>
                        <td>
                          <p>john doe</p>
                          <small className="text-muted">dentist</small>
                        </td>
                        <td>
                          <p className="text-muted">male</p>
                        </td>
                        <td className="text-right">
                          <p>24y</p>
                        </td>
                        <td className="text-right">
                          <button className="btn">
                            <i className="las la-check-circle" />
                          </button>
                          <button className="btn">
                            <i className="las la-times-circle" />
                          </button>
                        </td>
                        <td>
                          <button className="btn btn-sm">
                            <i className="las la-ellipsis-h" />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <img
                            className="rounded-circle"
                            src="../SiteAssets/images/man.svg"
                            loading="lazy"
                          />
                        </td>
                        <td>
                          <p>john doe</p>
                          <small className="text-muted">dentist</small>
                        </td>
                        <td>
                          <p className="text-muted">male</p>
                        </td>
                        <td className="text-right">
                          <p>24y</p>
                        </td>
                        <td className="text-right">
                          <button className="btn">
                            <i className="las la-check-circle" />
                          </button>
                          <button className="btn">
                            <i className="las la-times-circle" />
                          </button>
                        </td>
                        <td>
                          <button className="btn btn-sm">
                            <i className="las la-ellipsis-h" />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <img
                            className="rounded-circle"
                            src="../SiteAssets/images/man.svg"
                            loading="lazy"
                          />
                        </td>
                        <td>
                          <p>john doe</p>
                          <small className="text-muted">dentist</small>
                        </td>
                        <td>
                          <p className="text-muted">male</p>
                        </td>
                        <td className="text-right">
                          <p>24y</p>
                        </td>
                        <td className="text-right">
                          <button className="btn">
                            <i className="las la-check-circle" />
                          </button>
                          <button className="btn">
                            <i className="las la-times-circle" />
                          </button>
                        </td>
                        <td>
                          <button className="btn btn-sm">
                            <i className="las la-ellipsis-h" />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <img
                            className="rounded-circle"
                            src="../SiteAssets/images/man.svg"
                            loading="lazy"
                          />
                        </td>
                        <td>
                          <p>john doe</p>
                          <small className="text-muted">dentist</small>
                        </td>
                        <td>
                          <p className="text-muted">male</p>
                        </td>
                        <td className="text-right">
                          <p>24y</p>
                        </td>
                        <td className="text-right">
                          <button className="btn">
                            <i className="las la-check-circle" />
                          </button>
                          <button className="btn">
                            <i className="las la-times-circle" />
                          </button>
                        </td>
                        <td>
                          <button className="btn btn-sm">
                            <i className="las la-ellipsis-h" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="card-footer">
                  <a className="view-more">
                    more
                    <i className="las la-angle-right" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
