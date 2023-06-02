import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { rooms } from "../../adminAPI.js";
import LoadingSpinner from "../../components/Loading.js";
import Search from "../../components/Search.js";
import {
  PagenationNavigate,
  PagenationResult,
} from "../../components/Pagenation.js";
import SortDropdown from "../../components/SortDropdown.js";

const Rooms = () => {
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState();
  const [length, setLength] = useState();
  const [srchFilter, setSrchFilter] = useState();
  const [roomList, setRoomList] = useState();

  let resultLimit = 12;
  let table = ["name", "level", "type", "current", "history", " "];
  let sortValues = [
    ["name", "Name ascending"],
    ["-name", "Name descending"],
    ["level", "Level ascending"],
    ["-level", "Level descending"],
    ["-createdAt", "Newest"],
    ["createdAt", "Oldest"],
  ];

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
    setRoomList(room.room);
    setLength(room.length);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    GetRoom();
  }, [srchFilter]);

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
          <SortDropdown
            sortValues={sortValues}
            setLoading={setLoading}
            GetDetails={GetRoom}
            selOpt={"name"}
          />
          <Search search={setSrchFilter} type={"room"} />
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
            <PagenationResult
              pageNo={pageNo}
              length={length}
              resultLimit={resultLimit}
            />
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
                            >
                              {" "}
                              view room
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
      <PagenationNavigate
        length={length}
        resultLimit={resultLimit}
        setLoading={setLoading}
        GetDetails={GetRoom}
      />
    </div>
  );
};

export default Rooms;
