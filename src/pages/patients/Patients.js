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

const Patients = () => {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState();
  const [pageNo, setPageNo] = useState();
  const [length, setLength] = useState();
  const [srchFilter, setSrchFilter] = useState();

  let resultLimit = 12;
  let sortValues = [
    ["-createdAt", "Newest"],
    ["createdAt", "Oldest"],
    ["name", "Name ascending"],
    ["-name", "Name descending"],
    ["-patientInfo.birthDate", "New born"],
    ["patientInfo.birthDate", "Old born"],
    ["-gender", "Male"],
    ["gender", "Female"],
  ];

  const GetDetails = async () => {
    console.log("sad");
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
                  setLoading(true);
                  GetDetails();
                }}
              >
                {sortValues.map((e) => {
                  if (e[0] == "-createdAt") {
                    return (
                      <option selected value={e[0]}>
                        {e[1]}
                      </option>
                    );
                  }
                  return <option value={e[0]}>{e[1]}</option>;
                })}
              </select>
            </div>
          </div>
          <SwitchView />
          <Search search={setSrchFilter} type={"user"} />
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
            <PagenationResult
              pageNo={pageNo}
              length={length}
              resultLimit={resultLimit}
            />
            <CardView type="patient" data={patients} />
            <TableView type="patient" data={patients} display="no-display" />
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

export default Patients;
