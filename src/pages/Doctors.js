import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { users } from "../../src/adminAPI";
import manImg from "../images/man.svg";
import moment from "moment";
import LoadingSpinner from "../components/Loading.js";

const Doctors = () => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState();
  const [pageNo, setPageNo] = useState();
  const [length, setLength] = useState();
  let resultLimit = 12;

  const GetDetails = async () => {
    let currentPage = "";
    document.getElementsByName("page").forEach((e) => {
      if (e.parentElement.classList.contains("active")) {
        currentPage = e.tabIndex;
      }
    });
    setPageNo(currentPage);
    let sort = document.getElementById("sort").value;
    let body = {
      role: "doctor",
      sort: sort,
      pageNo: currentPage,
      limit: resultLimit,
    };
    let user = await users(body);
    setLength(user.length);
    setDoctors(user.users);
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);
    GetDetails();
  }, []);

  let changeViewCard = () => {
    document.getElementById("cv").classList.remove("no-display");
    document.getElementById("tv").classList.add("no-display");
    document.getElementById("tab").classList.remove("active");
    document.getElementById("card").classList.add("active");
  };
  let changeViewRow = () => {
    document.getElementById("tv").classList.remove("no-display");
    document.getElementById("cv").classList.add("no-display");
    document.getElementById("tab").classList.add("active");
    document.getElementById("card").classList.remove("active");
  };

  let pagination = () => {
    let pages = [];
    for (let i = 2; i <= Math.ceil(length / resultLimit); i++) {
      pages.push(
        <li
          class="page-item"
          onClick={(e) => {
            changePage(e);
          }}
        >
          <button class="page-link" name="page" tabIndex={i}>
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  let changePage = (e) => {
    let btn = document.getElementsByName("page");
    Array.from(btn).map((e) => {
      e.parentElement.classList.remove("active");
    });
    e.target.parentElement.classList.add("active");
    GetDetails();
  };

  return (
    <React.Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="main-content">
          <div className="container-fluid">
            <div className="section title-section">
              <h5 className="page-title">doctors</h5>
            </div>
            <div className="section filters-section">
              <div className="dropdowns-wrapper">
                <div className="dropdown">
                  <select
                    id="sort"
                    className="form-select dropdown-toggle"
                    role="button"
                    onChange={() => {
                      GetDetails();
                    }}
                  >
                    <option selected value="-createdAt">
                      Newest
                    </option>
                    <option value="createdAt">Oldest</option>
                    <option value="name">Name ascending</option>
                    <option value="-name">Name descending</option>
                    <option value="-doctorInfo.birthDate">New born</option>
                    <option value="doctorInfo.birthDate">Old born</option>
                    <option value="-gender">Male</option>
                    <option value="gender">Female</option>
                  </select>
                </div>
              </div>
              <div className="switch-view-btns">
                <div
                  className="btn-group btn-group-toggle"
                  data-toggle="buttons"
                >
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
                <Link to="/home/addDoctor">
                  <button className="btn btn-dark-red-f-gr">
                    <i className="las la-plus-circle" />
                    add a new doctor
                  </button>
                </Link>
              </div>
            </div>
            <div
              class="section "
              id="data-table6_info"
              role="status"
              aria-live="polite"
            >
              Showing{" "}
              <span style={{ color: "#00b4d8" }}>
                {pageNo < Math.ceil(length / resultLimit)
                  ? (pageNo - 1) * resultLimit + resultLimit
                  : length}
              </span>{" "}
              out of <span style={{ color: "#00b4d8" }}>{length} </span>results
            </div>
            <div id="cv" className="section patients-card-view">
              <div className="row">
                {doctors
                  ? doctors.map((doc) => {
                      return (
                        <div className="col-md-4">
                          <div className="card">
                            <div className="card-header">
                              <div className="card-img-top">
                                <img
                                  className="rounded-circle"
                                  src={manImg}
                                  loading="lazy"
                                />
                                <Link
                                  to="/home/doctorDetails"
                                  state={doc._id}
                                  className="view-more"
                                >
                                  view profile
                                </Link>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="card-subsection-title">
                                <h5>{doc.name}</h5>
                              </div>
                              <div className="card-subsection-body">
                                <label className="text-muted">speciality</label>
                                <p>{doc.doctorInfo?.speciality}</p>
                                <label className="text-muted">gender</label>
                                <p>{doc.gender}</p>
                                <label className="text-muted">email</label>
                                <p>{doc.email}</p>
                                <label className="text-muted">
                                  date of birth
                                </label>
                                <p>
                                  {doc.doctorInfo?.birthDate
                                    ? moment(doc.doctorInfo?.birthDate).format(
                                        "DD/MM/YYYY"
                                      )
                                    : ""}
                                </p>
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
                    <th>Gender</th>
                    <th>Specialization</th>
                    <th>Email</th>
                    <th>Date of birth</th>
                    <th>phone no.</th>
                    <th />
                    <th />
                  </tr>
                </thead>
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
                              <span className="ml-2">{doc.name}</span>
                            </td>
                            <td>{doc.gender}</td>
                            <td>{doc.doctorInfo?.speciality}</td>
                            <td>{doc.email}</td>
                            <td>
                              {doc.doctorInfo?.birthDate
                                ? moment(doc.doctorInfo?.birthDate).format(
                                    "DD/MM/YYYY"
                                  )
                                : ""}
                            </td>
                            <td>{doc.phone}</td>
                            <td>
                              <Link
                                to="/home/doctorDetails"
                                state={doc._id}
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
          <div aria-label="Page navigation example" className="section">
            <ul class="pagination justify-content-start">
              <li class="page-item disabled">
                <a class="page-link" tabindex="-1">
                  Pages
                </a>
              </li>
              <li
                class="page-item active"
                onClick={(e) => {
                  changePage(e);
                }}
              >
                <button class="page-link" name="page" tabIndex="1">
                  1
                </button>
              </li>
              {pagination()}
            </ul>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Doctors;
