import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGeneral, users } from "../../adminAPI";
import LoadingSpinner from "../../components/Loading.js";
import Categories from "../../components/Categories.js";
import CardView from "../../components/CardView.js";
import TableView from "../../components/TableView.js";
import SwitchView from "../../components/SwitchView.js";
import Search from "../../components/Search.js";
import stetho from "../../images/stetho.png";

import {
  PagenationNavigate,
  PagenationResult,
} from "../../components/Pagenation.js";

const Doctors = () => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState();
  const [filter, setFilter] = useState();
  const [pageNo, setPageNo] = useState();
  const [length, setLength] = useState();
  const [pageView, setPageView] = useState(false);
  const [srchFilter, setSrchFilter] = useState();
  const [spec, setSpec] = useState();

  let resultLimit = 12;
  let sortValues = [
    ["-createdAt", "Newest"],
    ["createdAt", "Oldest"],
    ["name", "Name ascending"],
    ["-name", "Name descending"],
    ["-doctorInfo.birthDate", "New born"],
    ["doctorInfo.birthDate", "Old born"],
    ["-gender", "Male"],
    ["gender", "Female"],
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
      speciality: filter,
      role: "doctor",
      sort: sort,
      pageNo: currentPage,
      limit: resultLimit,
    };
    filter == "all" && delete body.speciality;
    srchFilter && (body.filter = srchFilter);
    let user = await users(body);
    setLength(user.length);
    setDoctors(user.users);
    setLoading(false);
  };

  const GetSpecialities = async () => {
    let body = {
      filter: "specialities",
    };
    let general = await getGeneral(body);
    let data = general.data[0].specialities;
    let dataArr = [];
    data.map((e) => {
      let arr = [e, e];
      dataArr.push(arr);
    });
    setSpec(dataArr);
  };

  useEffect(() => {
    if (pageView) {
      setLoading(true);
      GetDetails();
    } else {
      GetSpecialities();
    }
  }, [filter, srchFilter]);

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section ">
          <div className="buttons-wrapper float-right">
            <Link to="/home/addDoctor">
              <button className="btn btn-dark-red-f-gr">
                <i className="las la-plus-circle" />
                add a new doctor
              </button>
            </Link>
          </div>
        </div>
        <div className="section title-section">
          <h5 className="page-title">doctors</h5>
        </div>
        {pageView ? (
          <>
            <div className="section filters-section">
              <div className="dropdowns-wrapper">
                <button
                  className="btn btn-dark-red-f-gr"
                  onClick={() => {
                    setPageView(false);
                  }}
                >
                  all specialities
                </button>
              </div>
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
              {filter == "all" && (
                <Search search={setSrchFilter} type={"user"} />
              )}
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
                <CardView type="doctor" data={doctors} />
                <TableView type="doctor" data={doctors} display="no-display" />
              </>
            )}
          </>
        ) : (
          spec && (
            <Categories
              image={stetho}
              data={spec}
              view={"doc"}
              filter={setFilter}
              pageView={setPageView}
            />
          )
        )}
      </div>
      {pageView && (
        <PagenationNavigate
          length={length}
          resultLimit={resultLimit}
          setLoading={setLoading}
          GetDetails={GetDetails}
        />
      )}
    </div>
  );
};

export default Doctors;
