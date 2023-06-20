import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoriesApi, favoraiteDoc, users } from "../../adminAPI";
import LoadingSpinner from "../../components/Loading.js";
import Categories from "../../components/Categories.js";
import CardView from "../../components/CardView.js";
import TableView from "../../components/TableView.js";
import SwitchView from "../../components/SwitchView.js";
import Search from "../../components/Search.js";
import stetho from "../../images/stetho.jpg";

import {
  PagenationNavigate,
  PagenationResult,
} from "../../components/Pagenation.js";
import SortDropdown from "../../components/SortDropdown.js";
import moment from "moment";

const Doctors = ({ role, id, favDocs, superAdmin }) => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState();
  const [pageNo, setPageNo] = useState();
  const [length, setLength] = useState(0);
  const [day, setDay] = useState(false);
  const [pageView, setPageView] = useState(false);
  const [srchFilter, setSrchFilter] = useState();
  const [spec, setSpec] = useState();
  const [favDoc, setFavDoc] = useState(favDocs);

  let resultLimit = 12;
  let sortValues = [
    ["createdAt:-1", "Newest"],
    ["createdAt:1", "Oldest"],
    ["name:1", "Name ascending"],
    ["name:-1", "Name descending"],
    ["doctorInfo.birthDate:-1", "New born"],
    ["doctorInfo.birthDate:1", "Old born"],
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
    let user = [];
    if (filter != "fav") {
      let sort = document.getElementById("sort").value;
      let body = {
        filter: {
          "doctorInfo.speciality": filter,
          role: "doctor",
        },
        sort: sort,
        pageNo: currentPage,
        limit: resultLimit,
      };
      if (role == "patient" || role == "admin") {
        body.filter["doctorInfo.available"] = true;
      }
      if (day) {
        body.filter["doctorInfo.schedule.day"] = moment()
          .format("dddd")
          .toLocaleLowerCase();
      }
      filter == "all" && delete body.filter["doctorInfo.speciality"];
      srchFilter && (body.filter = { ...body.filter, ...srchFilter });
      user = await users(body);
    } else {
      user = await favoraiteDoc({}, "get");
      let docs = user.users.map((e) => {
        return e._id;
      });
      setFavDoc(docs);
    }
    user.users.map((e) => {
      let arr = [];
      e.doctorInfo.schedule.map((o) => {
        if (!arr.includes(o.day)) {
          arr.push(o.day);
        }
      });
      e.scheduleDays = arr;
    });

    setLength(user.count);
    setDoctors(user.users);
    setLoading(false);
  };

  const GetSpecialities = async () => {
    let body = {
      filter: {
        type: "speciality",
      },
    };
    let { message, results } = await categoriesApi(body, "POST", "get");
    results = results.map((e) => {
      return [e.name, e.name];
    });
    results.unshift(["all", "all"]);
    if (role == "patient") {
      results.unshift(["fav", "favourites"]);
    }
    setSpec(results);
  };

  const addDocToFav = async ({ id }) => {
    let body = {
      docId: id,
    };
    let add = await favoraiteDoc(body);
    setFavDoc(add.users);
    console.log(add);
  };

  useEffect(() => {
    if (pageView) {
      setLoading(true);
      GetDetails();
    } else {
      GetSpecialities();
    }
  }, [filter, srchFilter, day]);

  return (
    <div className="main-content">
      <div className="container-fluid">
        {superAdmin && (
          <div className="section ">
            <div className="buttons-wrapper float-right">
              <Link to="/admin/addDoctor">
                <button className="btn btn-dark-red-f-gr">
                  <i className="las la-plus-circle" />
                  add a new doctor
                </button>
              </Link>
            </div>
          </div>
        )}

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
              {filter != "fav" && (
                <SortDropdown
                  sortValues={sortValues}
                  setLoading={setLoading}
                  GetDetails={GetDetails}
                  selOpt={"createdAt:-1"}
                />
              )}
              <SwitchView />
              {filter == "all" && (
                <Search search={setSrchFilter} type={"user"} />
              )}
              {filter != "fav" && (
                <div className="form-check ml-auto">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={true}
                    onChange={(e) => {
                      setDay(e.target.checked);
                    }}
                    id="todayDoc"
                  />
                  <label className="form-check-label" for="todayDoc">
                    today's doctors
                  </label>
                </div>
              )}
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              doctors.length > 0 && (
                <>
                  <PagenationResult
                    pageNo={pageNo}
                    length={length}
                    resultLimit={resultLimit}
                  />
                  <CardView
                    type="doctor"
                    data={doctors}
                    role={role}
                    favDocs={favDoc && favDoc}
                    addDocFavFun={addDocToFav}
                  />
                  <TableView
                    type="doctor"
                    data={doctors}
                    role={role}
                    display="no-display"
                  />
                </>
              )
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
