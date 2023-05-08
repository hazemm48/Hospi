import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { users } from "../../src/adminAPI";
import manImg from "../images/man.svg";
import moment from "moment";
import LoadingSpinner from "../components/Loading.js";
import Categories from "../components/Categories.js";

const UserList = (props) => {
  const [users, setUsers] = useState();
  const [pageNo, setPageNo] = useState();
  const [length, setLength] = useState();
  const [pageView, setPageView] = useState(false);
  const [categories, setCategories] = useState();
  let resultLimit = 12;

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
    <div className="main-content">
      <div className="container-fluid">
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

export default UserList;
