import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { users } from "../adminAPI.js";
import LoadingSpinner from "../components/Loading.js";
import manImg from "../images/man.svg";

const Doctors = () => {
  const [doctors, setDoctors] = useState();
  const [loading, setLoading] = useState(false);

  const GetDetails = async () => {
    let body = {
      role: "doctor",
    };
    let user = await users(body);
    setLoading(false);
    setDoctors(user.users);
  };

  useEffect(() => {
    setLoading(true);
    GetDetails();
  }, []);
  console.log(doctors);
  return (
    <React.Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="main-content">
          <div className="container-fluid">
            <div className="section title-section">
              <h5 className="page-title">Doctors</h5>
            </div>
            <div className="section filters-section justify-content-between">
              <div className="dropdowns-wrapper">
                <div className="dropdown">
                  <a
                    className="btn btn-dark-red-o dropdown-toggle"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    sort by
                  </a>
                  <div
                    className="dropdown-menu shadow-lg"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <a className="dropdown-item">name</a>
                    <a className="dropdown-item">gender</a>
                    <a className="dropdown-item">specialization</a>
                    <a className="dropdown-item">email</a>
                    <a className="dropdown-item">phone no.</a>
                    <a className="dropdown-item">address</a>
                  </div>
                </div>
              </div>
              <div className="buttons-wrapper">
                <Link to="/home/addDoctor">
                  <button className="btn btn-dark-red-f-gr">
                    <i className="las la-plus-circle" />
                    add a new doctor
                  </button>
                </Link>
              </div>
            </div>
            <div className="section specialists-table-view">
              <table className="table table-hover table-responsive-lg">
                <thead>
                  <tr>
                    <th>name</th>
                    <th>gender</th>
                    <th>specialization</th>
                    <th>email</th>
                    <th>phone no.</th>
                    <th>city</th>
                    <th />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {doctors
                    ? doctors.map((doc) => {
                        return (
                          <tr>
                            <td className="ml-2">
                              <img
                                className="rounded-circle"
                                src={manImg}
                                loading="lazy"
                              />
                              <span className="ml-2">{doc.name}</span>
                            </td>
                            <td className="text-muted">{doc.gender}</td>
                            <td>{doc.doctorInfo?.speciality}</td>
                            <td className="text-lowercase text-muted">
                              {doc.email}
                            </td>
                            <td>{doc.phone}</td>
                            <td className="text-muted">
                              {doc.doctorInfo?.city}
                            </td>
                            <td>
                              <button className="btn btn-sm btn-dark-red-f">
                                reserve
                              </button>
                            </td>
                            <td>
                              <a>
                                <i className="las la-info-circle" />
                              </a>
                            </td>
                          </tr>
                        );
                      })
                    : ""}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Doctors;
