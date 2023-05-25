import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { rooms } from "../adminAPI.js";
import LoadingSpinner from "../components/Loading.js";
import TableView from "../components/TableView.js";

const Rooms = () => {
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState();
  const [length, setLength] = useState();
  const [srchFilter, setSrchFilter] = useState();
  const [roomList, setRoomList] = useState();
  const [table, setTable] = useState([
    "name",
    "level",
    "type",
    "current",
    "history",
    " ",
  ]);
  let resultLimit = 12;

  let navigate = useNavigate();

  const GetRoom = async () => {
    let currentPage = "";
    document.getElementsByName("page").forEach((e) => {
      if (e.parentElement.classList.contains("active")) {
        currentPage = e.tabIndex;
      }
    });
    setPageNo(currentPage);
    let sort = document.getElementById("sort").value;
    let body = {
      filter: {},
      sort: sort,
      pageNo: currentPage,
      limit: resultLimit,
    };
    srchFilter && (body.filter = srchFilter);

    let room = await rooms(body, "POST", "get");
    console.log(room);
    setRoomList(room.room);
    setLength(room.length);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    GetRoom();
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
      if (srchSlct == "name") searchIn = searchIn.toLowerCase();
      data[srchSlct] = searchIn;
      setSrchFilter(data);
    }
    if (srchSlct == "all") {
      formEl.querySelector("input").value = "";
      setSrchFilter();
    }
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
    GetRoom();
  };

  let GoToDoc = (e) => {
    navigate("/home/DoctorDetails", {
      state: e.target.value,
    });
  };

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section title-section">
          <h5 className="page-title">Rooms</h5>
        </div>
        <div className="section filters-section">
          <div className="dropdowns-wrapper">
            <div className="dropdown">
              <select
                id="sort"
                className="form-select dropdown-toggle"
                role="button"
                onChange={() => {
                  GetRoom();
                }}
              >
                <option selected value="name">
                  Name ascending
                </option>
                <option value="-name">Name descending</option>
                <option value="level">Level ascending</option>
                <option value="-level">Level descending</option>
                <option value="-createdAt">Newest</option>
                <option value="createdAt">Oldest</option>
              </select>
            </div>
          </div>
          <form id="search" className="ml-auto">
            <div className="form">
              <div className="form-group col-sm-12">
                <div className="input-group ">
                  <div class="input-group-append">
                    <select class="input-group-text" name="srchSlct" required>
                      <option value="all">All</option>
                      <option value="_id">ID</option>
                      <option value="name">Name</option>
                      <option value="level">LEVEL</option>
                      <option value="type">TYPE</option>
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
            <Link to="/home/addRoom">
              <button className="btn btn-dark-red-f-gr">
                <i className="las la-plus-circle" />
                add a new room
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
            <div id="tv" className={`section patients-table-view`}>
              <table className="table table-hover table-responsive-lg">
                <thead>
                  <tr>
                    {table?.map((e) => {
                      return <th>{e}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {roomList &&
                    roomList.map((r) => {
                      return (
                        <tr>
                          <td>{r.name.toUpperCase()}</td>
                          <td>{r.level}</td>
                          <td>{r.type}</td>
                          {["current", "history"].map((e) => {
                            return (
                              <td>
                                <div className="dropdowns-wrapper">
                                  <div className="dropdown">
                                    <select
                                      id={e}
                                      className="form-select dropdown-toggle"
                                      role="button"
                                      onChange={(e) => {
                                        GoToDoc(e);
                                      }}
                                    >
                                      <option selected disabled>
                                        -- room {e} --
                                      </option>
                                      {r[e].map((doc) => {
                                        return (
                                          <option value={doc}>{doc}</option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                          <td>
                            <Link
                              to={"/home/roomDetails"}
                              state={r._id}
                              className="view-more btn btn-sm btn-dark-red-f"
                            > view room
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
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

export default Rooms;
