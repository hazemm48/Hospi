import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { uploadFile, users } from "../../src/adminAPI";
import manImg from "../images/man.svg";
import moment from "moment";
import LoadingSpinner from "../components/Loading.js";
import CardView from "../components/CardView.js";
import TableView from "../components/TableView.js";

const Patients = () => {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState();
  const [pageNo, setPageNo] = useState();
  const [length, setLength] = useState();
  const [srchFilter, setSrchFilter] = useState();
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
      role: "patient",
      sort: sort,
      pageNo: currentPage,
      limit: resultLimit,
    };
    srchFilter && (body.filter = srchFilter);
    let user = await users(body);
    setLength(user.length);
    setPatients(user.users);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    GetDetails();
  }, [srchFilter]);

  let searchData = () => {
    let formEl = document.forms.search;
    let formData = new FormData(formEl);
    let searchIn = formData.get("search");
    let srchSlct = formData.get("srchSlct");
    let data = {};
    if (
      !(
        (srchSlct == "_id" && (searchIn.length < 24 || searchIn.length > 24)) ||
        srchSlct == "all"
      )
    ) {
      data[srchSlct] = searchIn;
      setSrchFilter(data);
    }
    if (srchSlct == "all") {
      formEl.querySelector("input").value = "";
      setSrchFilter();
    }
  };

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
    setLoading(true)
    GetDetails();
  };

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section title-section">
          <h5 className="page-title">Patients</h5>
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
          <form id="search" method="post" className="ml-auto">
            <div className="form">
              <div className="form-group col-sm-12">
                <div className="input-group ">
                  <div class="input-group-append">
                    <select class="input-group-text" name="srchSlct" required>
                      <option value="all">All</option>
                      <option value="_id">ID</option>
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                  <input name="search" className="form-control" />
                  <div class="input-group-append">
                    <button
                      type="button"
                      className="input-group-text"
                      id="basic-addon2"
                      onClick={() => {
                        searchData();
                      }}
                    >
                      <i className="las la-search" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="buttons-wrapper ml-auto">
            <Link to="/home/addPatient">
              <button className="btn btn-dark-red-f-gr">
                <i className="las la-plus-circle" />
                add a new patient
              </button>
            </Link>
          </div>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
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
            <CardView type="patient" data={patients}  />
            <TableView type="patient" data={patients} display="no-display" />
          </>
        )}
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
  );
};

export default Patients;
