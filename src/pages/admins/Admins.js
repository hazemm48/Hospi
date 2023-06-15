import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { users } from "../../adminAPI.js";
import LoadingSpinner from "../../components/Loading.js";
import CardView from "../../components/CardView.js";
import TableView from "../../components/TableView.js";
import SwitchView from "../../components/SwitchView.js";
import Search from "../../components/Search.js";
import {
  PagenationNavigate,
  PagenationResult,
} from "../../components/Pagenation.js";
import SortDropdown from "../../components/SortDropdown.js";

const Admins = ({ role }) => {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState();
  const [pageNo, setPageNo] = useState();
  const [length, setLength] = useState();
  const [srchFilter, setSrchFilter] = useState();

  let resultLimit = 12;
  let sortValues = [
    ["createdAt:-1", "Newest"],
    ["createdAt:1", "Oldest"],
    ["name:1", "Name ascending"],
    ["name:-1", "Name descending"],
    ["gender:-1", "Male"],
    ["gender:1", "Female"],
  ];

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
      filter: {
        role: "admin",
      },
      sort: sort,
      pageNo: currentPage,
      limit: resultLimit,
    };
    srchFilter && (body.filter = { ...body.filter, ...srchFilter });
    let user = await users(body);
    user.users.map((e, i) => {
      if (e.email == process.env.REACT_APP_SA) {
        user.users.splice(i, 1);
        user.count = user.count - 1;
      }
    });
    setLength(user.count);
    setPatients(user.users);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    GetDetails();
  }, [srchFilter]);

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section title-section">
          <h5 className="page-title">Admins</h5>
        </div>
        <div className="section filters-section">
          <SortDropdown
            sortValues={sortValues}
            setLoading={setLoading}
            GetDetails={GetDetails}
            selOpt={"createdAt:-1"}
          />
          <SwitchView />
          <Search search={setSrchFilter} type={"user"} />
          <div className="buttons-wrapper ml-auto">
            <Link to="/admin/addAdmin">
              <button className="btn btn-dark-red-f-gr">
                <i className="las la-plus-circle" />
                add a new admin
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
            <CardView type="admin" data={patients} role={role} />
            <TableView type="admin" data={patients} display="no-display" />
          </>
        )}
      </div>
      <PagenationNavigate
        length={length}
        resultLimit={resultLimit}
        setLoading={setLoading}
        GetDetails={GetDetails}
      />
    </div>
  );
};

export default Admins;
