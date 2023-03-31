import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { users } from "../../src/adminAPI";
import moment from "moment";

const Patients = () => {
  const [patients, setPatients] = useState();

  let ds = async () => {
    let sort = document.getElementById("sort").value;
    console.log("hiksdf");
    let body = {
      role: "patient",
      sort: sort,
    };
    let user = await users(body);
    setPatients(user);
  };

  useEffect(() => {
    const GetDetails = async () => {
      let sort = document.getElementById("sort").value;

      let body = {
        role: "patient",
        sort: sort,
      };
      let user = await users(body);
      setPatients(user);
      console.log("hi");
    };
    GetDetails();
  }, []);
  console.log(patients);

  let changeViewCard = () => {
    document.getElementById("cv").classList.remove("no-display");
    document.getElementById("tv").classList.add("no-display");
    document.getElementById("tab").classList.remove("active","focus");
    document.getElementById("card").classList.add("active","focus");
  };
  let changeViewRow = () => {
    document.getElementById("tv").classList.remove("no-display");
    document.getElementById("cv").classList.add("no-display");
    document.getElementById("tab").classList.add("active","focus");
    document.getElementById("card").classList.remove("active","focus");
  };

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section title-section">
          <h5 className="page-title" >Patients</h5>
        </div>
        <div className="section filters-section">
          <div className="dropdowns-wrapper">
            <div className="dropdown">
              <select
                id="sort"
                className="form-select dropdown-toggle"
                role="button"
                onChange={() => {
                  ds();
                }}
              >
                <option selected value="-createdAt">
                  Newest
                </option>
                <option value="createdAt">Oldest</option>
                <option value="name">Name ascending</option>
                <option value="-name">Name descending</option>
                <option value="-patientInfo.birthDate">New born</option>
                <option value="patientInfo.birthDate">Old born</option>
                <option value="-gender">Male</option>
                <option value="gender">Female</option>
              </select>
            </div>
          </div>
          <div className="switch-view-btns">
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
              <label id="card" className="btn btn-darker-grey-o active">
                <input
                  id="card-view-btn"
                  type="radio"
                  name="options"
                  defaultChecked
                  onClick={() => {
                    changeViewCard();
                  }}
                />
                <i className="las la-th-large" />
              </label>
              <label id="tab" className="btn btn-darker-grey-o">
                <input
                  id="table-view-btn"
                  type="radio"
                  name="options"
                  onClick={() => {
                    changeViewRow();
                  }}
                />
                <i className="las la-list-ul" />
              </label>
            </div>
          </div>
          <div className="buttons-wrapper ml-auto">
            <Link to="/home/addPatient">
              <button className="btn btn-dark-red-f-gr">
                <i className="las la-plus-circle" />
                add a new patient
              </button>
            </Link>
          </div>
        </div>
        <div id="cv" className="section patients-card-view">
          <div className="row">
            {patients
              ? patients.map((pat) => {
                  return (
                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-header">
                          <div className="card-img-top">
                            <img
                              className="rounded-circle"
                              src="../SiteAssets/images/people.svg"
                              loading="lazy"
                            />
                            <Link
                              to="/home/PatientDetails"
                              state={pat._id}
                              className="view-more"
                            >
                              view profile
                            </Link>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="card-subsection-title">
                            <h5>{pat.name}</h5>
                          </div>
                          <div className="card-subsection-body">
                            <label className="text-muted">email</label>
                            <p>{pat.email}</p>
                            <label className="text-muted">date of birth</label>
                            <p>
                              {moment(pat.patientInfo?.birthDate).format(
                                "DD/MM/YYYY"
                              )}
                            </p>
                            <label className="text-muted">gender</label>
                            <p>{pat.gender}</p>
                          </div>
                        </div>
                        <div className="card-footer" />
                      </div>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
        <div id="tv" className="section patients-table-view no-display">
          <table className="table table-hover table-responsive-lg">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Date of birth</th>
                <th>Gender</th>
                <th>Email</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {patients
                ? patients.map((pat) => {
                    return (
                      <tr>
                        <td>
                          <img
                            className="rounded-circle"
                            src="../SiteAssets/images/people.svg"
                            loading="lazy"
                          />
                          <span className="ml-2">{pat.name}</span>
                        </td>
                        <td>
                          {moment().diff(pat.patientInfo?.birthDate, "years")}
                        </td>
                        <td>
                          {moment(pat.patientInfo?.birthDate).format(
                            "DD/MM/YYYY"
                          )}
                        </td>
                        <td>{pat.gender}</td>
                        <td>{pat.email}</td>
                        <td>
                          <Link
                            to="/home/PatientDetails"
                            state={pat._id}
                            className="view-more btn btn-sm btn-dark-red-f"
                          >
                            view profile
                          </Link>
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
  );
};

export default Patients;
